import React from 'react';

const Card = () => {
  return (
    <div className="bg-amber-50 p-4 font-serif max-w-sm mx-auto border-2 border-amber-900 overflow-hidden">
      <div className="text-center border-b-2 border-amber-900 pb-2 mb-2">
        <h1 className="text-xl font-bold text-amber-900">INFUSED PAINKILLER BATCH</h1>
        <p className="text-sm italic text-amber-700">Makes ~143 oz (4-5 swing-top bottles) • ~15% ABV</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="col-span-1 border-r border-amber-300 pr-2">
          <h2 className="font-bold text-amber-900 underline">INGREDIENTS:</h2>
          <ul className="text-xs list-disc pl-4 leading-tight">
            <li>51 oz dark rum (40% ABV)</li>
            <li>60 oz pineapple juice</li>
            <li>15 oz orange juice</li>
            <li>16.9 oz cream of coconut</li>
            <li>Whole nutmeg for garnish</li>
            <li className="font-bold mt-1">INFUSION MIX:</li>
            <li className="ml-2">1 cup pineapple chunks</li>
            <li className="ml-2">2 cinnamon sticks</li>
            <li className="ml-2">4 whole cloves</li>
            <li className="ml-2">Peel of 1 orange</li>
          </ul>
        </div>
        
        <div className="col-span-1">
          <h2 className="font-bold text-amber-900 underline">EQUIPMENT:</h2>
          <ul className="text-xs list-disc pl-4 leading-tight">
            <li>4-5 1L swing-top bottles</li>
            <li>Star San sanitizer</li>
            <li>Funnel or bottling wand</li>
            <li>Large mixing container</li>
            <li>Measuring cups/vessels</li>
            <li>Fine-mesh strainer</li>
            <li>Instant Pot</li>
          </ul>
        </div>
      </div>
      
      <div className="mb-2">
        <h2 className="font-bold text-amber-900 underline">DIRECTIONS:</h2>
        <ol className="text-xs list-decimal pl-4 leading-tight">
          <li><span className="font-bold">Sanitize bottles:</span> Soak bottles, gaskets & tops in Star San solution for 1-2 minutes. Drain upside down.</li>
          
          <li><span className="font-bold">Create rum infusion:</span> Combine 16 oz rum with all infusion ingredients in Instant Pot. Slow Cook on low for 1 hour. Cool completely, then strain.</li>
          
          <li><span className="font-bold">Mix ingredients:</span> In large container, combine cream of coconut with half the rum (including infused portion). Stir until integrated. Add juices and remaining rum. Mix thoroughly.</li>
          
          <li><span className="font-bold">Bottle:</span> Fill sanitized bottles using funnel or bottling wand. Leave 1" headspace. Secure swing-tops.</li>
          
          <li><span className="font-bold">Store:</span> Keep in cool, dark place. Shelf-stable for 1-2 months. Refrigeration extends life to 3+ months.</li>
          
          <li><span className="font-bold">Serve:</span> Shake bottle well. Pour 6-7oz over ice. Grate fresh nutmeg on top.</li>
        </ol>
      </div>
      
      <div className="text-center text-xs italic text-amber-700 border-t border-amber-300 pt-1">
        Batch prepared: ___/___/_____
      </div>
    </div>
  );
};

export default Card;