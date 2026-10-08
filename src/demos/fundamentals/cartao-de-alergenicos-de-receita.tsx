import React, { useState, useMemo } from 'react';

interface Ingredient {
  id: string;
  name: string;
  isAllergen: boolean;
  allergenType: 'leite' | 'trigo' | 'outro' | null;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

const ALLERGENS_DATA: Record<string, string> = {
  'leite': 'Leite',
  'trigo': 'Trigo',
};

const RECIPES: Recipe[] = [
  {
    id: 'recipe-001',
    name: 'Pão Integral',
    ingredients: [
      { id: 'ing-001', name: 'Farinha de trigo', isAllergen: true, allergenType: 'trigo' },
      { id: 'ing-002', name: 'Água', isAllergen: false, allergenType: null },
      { id: 'ing-003', name: 'Levedura', isAllergen: false, allergenType: null },
    ],
  },
  {
    id: 'recipe-002',
    name: 'Bolo de Cenoura',
    ingredients: [
      { id: 'ing-004', name: 'Cenoura', isAllergen: false, allergenType: null },
      { id: 'ing-005', name: 'Óleo vegetal', isAllergen: false, allergenType: null },
      { id: 'ing-006', name: 'Ovos', isAllergen: false, allergenType: null },
    ],
  },
  {
    id: 'recipe-003',
    name: 'Massa de Pizza',
    ingredients: [
      { id: 'ing-007', name: 'Farinha de trigo', isAllergen: true, allergenType: 'trigo' },
      { id: 'ing-008', name: 'Água', isAllergen: false, allergenType: null },
      { id: 'ing-009', name: 'Fermento biológico', isAllergen: false, allergenType: null },
    ],
  },
  {
    id: 'recipe-004',
    name: 'Sopa de Legumes',
    ingredients: [
      { id: 'ing-010', name: 'Cenoura', isAllergen: false, allergenType: null },
      { id: 'ing-011', name: 'Batata', isAllergen: false, allergenType: null },
      { id: 'ing-012', name: 'Cebola', isAllergen: false, allergenType: null },
      { id: 'ing-013', name: 'Leite', isAllergen: true, allergenType: 'leite' },
    ],
  },
];

const AllergenCardDemo = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('recipe-001');
  const [expandedIngredients, setExpandedIngredients] = useState<Set<string>>(new Set());
  const [showAllAllergens, setShowAllAllergens] = useState<boolean>(false);

  const selectedRecipe = useMemo(
    () => RECIPES.find((r) => r.id === selectedRecipeId)!, 
    [selectedRecipeId]
  );

  const allergensInRecipe = useMemo(() => {
    const allergens = new Set<string>();
    selectedRecipe.ingredients.forEach((ing) => {
      if (ing.isAllergen && ing.allergenType) {
        allergens.add(ing.allergenType);
      }
    });
    return allergens;
  }, [selectedRecipe]);

  const toggleIngredientExpansion = (ingredientId: string) => {
    const newSet = new Set(expandedIngredients);
    if (newSet.has(ingredientId)) {
      newSet.delete(ingredientId);
    } else {
      newSet.add(ingredientId);
    }
    setExpandedIngredients(newSet);
  };

  const toggleShowAllAllergens = () => {
    setShowAllAllergens(!showAllAllergens);
  };

  const resetDemo = () => {
    setSelectedRecipeId('recipe-001');
    setExpandedIngredients(new Set());
    setShowAllAllergens(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 bg-white text-slate-900">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Cartão de Alergênicos de Receita
        </h1>
        <p className="text-slate-500">
          Selecione uma receita e visualize os alergênicos presentes nos ingredientes.
        </p>
      </header>

      {/* Recipe Selection */}
      <section className="space-y-4">
        <label htmlFor="recipe-select" className="block text-sm font-medium text-slate-700">
          Selecione uma receita
        </label>
        <select
          id="recipe-select"
          value={selectedRecipeId}
          onChange={(e) => setSelectedRecipeId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {RECIPES.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name}
            </option>
          ))}
        </select>
      </section>

      {/* Allergen Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Alergênicos na receita
          </h2>
          {allergensInRecipe.size > 0 && (
            <button
              onClick={toggleShowAllAllergens}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllAllergens ? 'Ocultar detalhes' : 'Ver todos alergênicos'}
            </button>
          )}
        </div>

        {allergensInRecipe.size === 0 ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              <strong>Ausência declarada:</strong> Esta receita não contém alergênicos conhecidos (leite ou trigo).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Esta receita contém {allergensInRecipe.size} alergênico(s):
            </p>
            <div className="space-y-2">
              {Array.from(allergensInRecipe).map((allergenType) => (
                <div
                  key={allergenType}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-xs font-bold">
                        {ALLERGENS_DATA[allergenType].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {ALLERGENS_DATA[allergenType]}
                      </p>
                      {showAllAllergens && (
                        <p className="text-sm text-slate-600 mt-1">
                          Ingredientes contendo {ALLERGENS_DATA[allergenType].toLowerCase()}:
                        </p>
                      )}
                    </div>
                  </div>
                  {showAllAllergens && (
                    <ul className="mt-2 ml-9 space-y-1 text-sm">
                      {selectedRecipe.ingredients
                        .filter((ing) => ing.allergenType === allergenType)
                        .map((ing) => (
                          <li key={ing.id} className="text-slate-700">
                            • {ing.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Ingredients List */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Ingredientes</h2>
        <div className="space-y-2">
          {selectedRecipe.ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className={`p-3 border rounded-md ${ingredient.isAllergen ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-800">
                      {ingredient.name}
                    </span>
                    {ingredient.isAllergen && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                        Alergênico: {ALLERGENS_DATA[ingredient.allergenType!]}
                      </span>
                    )}
                  </div>
                </div>
                {ingredient.isAllergen && (
                  <button
                    onClick={() => toggleIngredientExpansion(ingredient.id)}
                    className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {expandedIngredients.has(ingredient.id) ? 'Ocultar' : 'Detalhes'}
                  </button>
                )}
              </div>
              {expandedIngredients.has(ingredient.id) && ingredient.isAllergen && (
                <div className="mt-3 p-3 bg-yellow-100 rounded-md">
                  <p className="text-sm text-slate-700">
                    <strong>Risco:</strong> Este ingrediente contém {ALLERGENS_DATA[ingredient.allergenType!]} e pode causar reação alérgica em pessoas sensíveis.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Reset Button */}
      <section className="pt-4">
        <button
          onClick={resetDemo}
          className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
        >
          Reiniciar demonstração
        </button>
      </section>

      {/* Footer Note */}
      <section className="pt-4 text-xs text-slate-500">
        <p>⚠️ Este é um cartão demonstrativo. Consulte sempre a embalagem original do produto para informações atualizadas sobre alergênicos.</p>
      </section>
    </div>
  );
};

export default AllergenCardDemo;