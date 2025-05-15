'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Nutrition() {
  const [date, setDate] = useState<Date>(new Date());
  const [showAddFood, setShowAddFood] = useState(false);

  return (
    <div className="space-y-6 pr-[28px]">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Nutrition Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your meals and monitor your nutritional intake
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={date => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Calories</span>
              <span className="font-semibold">0 / 2000 kcal</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protein</span>
                <span>0g / 150g</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carbs</span>
                <span>0g / 250g</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fats</span>
                <span>0g / 65g</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fiber</span>
                <span>0g / 30g</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Meals */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Meals</h3>
            <Button onClick={() => setShowAddFood(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </div>

          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
              <TabsTrigger value="snacks">Snacks</TabsTrigger>
            </TabsList>

            {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
              <TabsContent key={meal} value={meal} className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  No foods added to {meal} yet
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>

      {/* Add Food Dialog */}
      {showAddFood && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-lg font-semibold">Add Food</h2>
              <p className="text-sm text-muted-foreground">
                Add a food item to your meal
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meal">Meal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="food">Food</Label>
                <Input id="food" placeholder="Search for a food item..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servingSize">Serving Size</Label>
                  <Input id="servingSize" type="number" min="0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servingUnit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="ml">Milliliters (ml)</SelectItem>
                      <SelectItem value="oz">Ounces (oz)</SelectItem>
                      <SelectItem value="cup">Cup</SelectItem>
                      <SelectItem value="tbsp">Tablespoon</SelectItem>
                      <SelectItem value="tsp">Teaspoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddFood(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Food</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
