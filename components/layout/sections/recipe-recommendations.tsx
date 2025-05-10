"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, ShoppingCart, Bot, User, MapPinned, ChefHat, ListChecks, Lightbulb, ListOrdered, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Product = {
  name: string;
  price: number;
  store: string;
  quantity: number;
  unit: string;
};

type StorePrices = {
  store: string;
  total_price: number;
  products: Product[];
};

type Message = {
  id: string;
  content: string;
  type: 'user' | 'bot';
  recipe?: {
    title: string;
    ingredients: string[];
    instructions: string[];
    tips: string[];
  };
  storePrices?: StorePrices;
};

const MOCK_PRODUCTS = [
  { id: 1, name: "Pomodori San Marzano", quantity: "500g", price: "€2.50", store: "Frutta e Verdura Santoro" },
  { id: 2, name: "Olio d'Oliva Extra Vergine", quantity: "500ml", price: "€6.90", store: "Emporio del Buongustaio" },
  { id: 3, name: "Basilico Fresco", quantity: "1 mazzo", price: "€1.80", store: "Alimentari San Marco" },
  { id: 4, name: "Mozzarella di Bufala", quantity: "200g", price: "€4.30", store: "Supermercato da Pina" },
  { id: 5, name: "Impasto per Pizza", quantity: "400g", price: "€1.20", store: "Spaccio Alimentare Il Fiorentino" },
  { id: 6, name: "Funghi Champignon", quantity: "250g", price: "€2.10", store: "Mercato Express Bellini" },
  { id: 7, name: "Prosciutto Crudo", quantity: "150g", price: "€3.90", store: "Alimentari La Luna" },
  { id: 8, name: "Formaggio Vegano", quantity: "180g", price: "€4.70", store: "Macelleria Leone" },
  { id: 9, name: "Farina di Grano Tenero", quantity: "1kg", price: "€1.40", store: "Minimarket Corti" },
  { id: 10, name: "Pomodorini Ciliegino", quantity: "300g", price: "€2.20", store: "Spaccio Goloso Ferrara" }
];

const staticRecipeResponse = {
  chat_response: `### Pizza Margherita

**Ingredients:**
- 400g Impasto per Pizza
- 500g Pomodori San Marzano
- 200g Mozzarella di Bufala
- 1 mazzo Basilico Fresco
- 50ml Olio d'Oliva Extra Vergine
- Sale q.b.

**Instructions:**
1. Stendere l'impasto per pizza su una teglia
2. Tritare i pomodori San Marzano e distribuirli sulla pizza
3. Aggiungere la mozzarella di bufala a pezzi
4. Condire con olio d'oliva extra vergine
5. Cuocere in forno a 250°C per 12-15 minuti
6. Aggiungere il basilico fresco a fine cottura

**Tips:**
- Riscaldare il forno almeno 30 minuti prima
- Usare una pietra refrattaria per una cottura migliore
- Non sovraccaricare la pizza con troppi ingredienti`,
  store_prices: {
    store: "Spaccio Alimentare Il Fiorentino",
    total_price: 16.70,
    products: [
      {
        name: "Impasto per Pizza",
        price: 1.20,
        store: "Spaccio Alimentare Il Fiorentino",
        quantity: 400,
        unit: "g"
      },
      {
        name: "Pomodori San Marzano",
        price: 2.50,
        store: "Frutta e Verdura Santoro",
        quantity: 500,
        unit: "g"
      },
      {
        name: "Mozzarella di Bufala",
        price: 4.30,
        store: "Supermercato da Pina",
        quantity: 200,
        unit: "g"
      },
      {
        name: "Basilico Fresco",
        price: 1.80,
        store: "Alimentari San Marco",
        quantity: 1,
        unit: "mazzo"
      },
      {
        name: "Olio d'Oliva Extra Vergine",
        price: 6.90,
        store: "Emporio del Buongustaio",
        quantity: 500,
        unit: "ml"
      }
    ]
  }
};

export const RecipeRecommendationsSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your Nonna assistant. I can help you find recipes and create shopping lists. What would you like to cook today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseRecipeResponse = (response: string) => {
    const lines = response.split('\n');
    const title = lines[0].replace('### ', '');
    const ingredients: string[] = [];
    const instructions: string[] = [];
    const tips: string[] = [];
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('**Ingredients:**')) {
        currentSection = 'ingredients';
        continue;
      } else if (trimmedLine.startsWith('**Instructions:**')) {
        currentSection = 'instructions';
        continue;
      } else if (trimmedLine.startsWith('**Tips:**')) {
        currentSection = 'tips';
        continue;
      }

      if (!trimmedLine.startsWith('###')) {
        if (currentSection === 'ingredients' && trimmedLine.startsWith('- ')) {
          ingredients.push(trimmedLine.replace('- ', ''));
        } else if (currentSection === 'instructions' && /^\d+\./.test(trimmedLine)) {
          instructions.push(trimmedLine.replace(/^\d+\.\s*/, ''));
        } else if (currentSection === 'tips' && trimmedLine.startsWith('- ')) {
          tips.push(trimmedLine.replace('- ', ''));
        }
      }
    }

    return { title, ingredients, instructions, tips };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch('http://127.0.0.1:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_message: inputMessage,
          user_id: "user123"
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      const recipe = parseRecipeResponse(data.chat_response);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Here's a recipe I recommend:",
        recipe,
        storePrices: data.store_prices
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Use static response when server is not available
      const recipe = parseRecipeResponse(staticRecipeResponse.chat_response);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Here's a recipe I recommend (using demo data since the server is not available):",
        recipe,
        storePrices: staticRecipeResponse.store_prices
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Show a less alarming error message
      setServerError("Using demo data - Backend server is not available");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="recipe-recommendations" className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Nonna
          </h2>
          <p className="text-muted-foreground text-lg">
            Chat with our AI to discover recipes and get personalized shopping recommendations.
          </p>
        </div>

        {serverError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {serverError}
            </AlertDescription>
          </Alert>
        )}

        <Card className="w-full">
          <CardContent className="p-0">
            <ScrollArea ref={scrollRef} className="h-[600px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`rounded-lg p-4 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.recipe && (
                          <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-2">
                              <ChefHat className="w-4 h-4" />
                              <h3 className="font-semibold">{message.recipe.title}</h3>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <ListChecks className="w-4 h-4" />
                                <h4 className="font-medium">Ingredients:</h4>
                              </div>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {message.recipe.ingredients.map((ingredient, index) => (
                                  <li key={index}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <ListOrdered className="w-4 h-4" />
                                <h4 className="font-medium">Instructions:</h4>
                              </div>
                              <ol className="list-decimal list-inside text-sm space-y-1">
                                {message.recipe.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ol>
                            </div>

                            {message.recipe.tips.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4" />
                                  <h4 className="font-medium">Tips:</h4>
                                </div>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {message.recipe.tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <Separator />

                            {message.storePrices && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Available Products:</h4>
                                <div className="space-y-2">
                                  {message.storePrices.products.map((product, index) => (
                                    <Card key={index} className="bg-background">
                                      <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <CardTitle className="text-sm">{product.name}</CardTitle>
                                            <CardDescription className="text-xs">
                                              {product.quantity} {product.unit}
                                            </CardDescription>
                                          </div>
                                          <Badge variant="secondary" className="text-xs">
                                            €{product.price.toFixed(2)}
                                          </Badge>
                                        </div>
                                      </CardHeader>
                                      <CardContent className="pt-0">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPinned className="w-3 h-3" />
                                            {product.store}
                                          </span>
                                          <Button variant="ghost" size="sm" className="h-7">
                                            <ShoppingCart className="h-3 w-3 mr-1" />
                                            Add
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                                <div className="text-sm font-medium mt-2">
                                  Total Price: €{message.storePrices.total_price.toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="rounded-lg p-4 bg-secondary">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                //   onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}; 