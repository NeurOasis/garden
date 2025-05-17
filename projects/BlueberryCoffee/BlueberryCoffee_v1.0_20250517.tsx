import React from 'react';

const RecipeCard = () => {
  return (
    <div className="w-5/6 mx-auto bg-blue-50 border-3 border-blue-900 p-3 font-serif rounded-lg" style={{aspectRatio: '4/6', maxWidth: '400px'}}>
      {/* Header */}
      <div className="text-center border-b-2 border-blue-900 pb-1 mb-1">
        <h1 className="text-lg font-bold text-blue-900">BLUEBERRY COBBLER COFFEE MIX</h1>
        <p className="text-xs italic text-blue-800">Single 12oz jar recipe - fills about 8oz by volume</p>
      </div>
      
      {/* Main content in 2 columns */}
      <div className="grid grid-cols-2 gap-1">
        {/* Left column */}
        <div className="border-r border-blue-300 pr-1">
          <h2 className="font-bold text-blue-900 text-xs mb-1">INGREDIENTS:</h2>
          <ul className="list-disc pl-3 text-xs leading-tight">
            <li>1 cup blueberry powder</li>
            <li>1 Tbsp freeze-dried blueberries (crushed)</li>
            <li>¼ cup vanilla powder</li>
            <li>⅓ cup brown sugar</li>
            <li>1½ tsp cinnamon</li>
            <li>⅛ tsp nutmeg</li>
            <li>⅛ tsp lemon zest (dried)</li>
            <li>¼ tsp salt</li>
          </ul>
          
          <h2 className="font-bold text-blue-900 text-xs mt-1 mb-0.5">DIRECTIONS:</h2>
          <ol className="list-decimal pl-3 text-xs leading-tight">
            <li><span className="font-bold">Prepare</span> blueberry powder by grinding freeze-dried berries</li>
            <li><span className="font-bold">Slightly crush</span> the extra 1 Tbsp berries</li>
            <li><span className="font-bold">Mix directly in jar</span> or in a bowl first</li>
            <li><span className="font-bold">Leave</span> ~⅓ of jar empty for shaking</li>
          </ol>
        </div>
        
        {/* Right column */}
        <div>
          <h2 className="font-bold text-blue-900 text-xs mb-1">DOUBLE BATCH:</h2>
          <ul className="list-disc pl-3 text-xs leading-tight">
            <li>2 cups blueberry powder</li>
            <li>2 Tbsp crushed blueberries</li>
            <li>½ cup vanilla powder</li>
            <li>¾ cup brown sugar</li>
            <li>1 Tbsp cinnamon</li>
            <li>¼ tsp nutmeg</li>
            <li>¼ tsp lemon zest</li>
            <li>½ tsp salt</li>
          </ul>
          
          <div className="mt-1.5 bg-blue-100 p-1 rounded-lg border border-blue-300">
            <h3 className="font-bold text-blue-900 text-xs">TO USE:</h3>
            <p className="text-xs leading-tight">Add 1-2 teaspoons to ground coffee before brewing, or stir into hot black coffee.</p>
            <p className="text-xs leading-tight mt-0.5">For sweeter taste: Add a tiny pinch of monk fruit or stevia.</p>
          </div>
          
          <div className="mt-1 text-xs italic text-blue-800 leading-tight">
            <p>• Yields ~25 servings per jar</p>
            <p>• Store in cool, dry place (3 months)</p>
            <p>• Shake jar well before each use</p>
            <p>• Lemon zest enhances blueberry flavor</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs italic text-blue-700 border-t border-blue-300 pt-1 mt-1">
        <p>Date prepared: ___/___/_____</p>
      </div>
    </div>
  );
};

export default RecipeCard;