import { Controller, Post } from "@nestjs/common";

import { MapService } from "./map.service";

@Controller("maps") 
export class MapController {

  constructor(private readonly mapService:MapService) {}

  @Post()
  async createMap(){
    return this.mapService.saveMapInFirebase(mapSchema_Test)
  }
}

const mapSchema_Test: string[][] = [
  ['LC', 'T-', 'T-', 'T-', 'T-', 'T-', 'T-','T-', 'T-', 'T-', 'T-', 'T-', 'T-', 'T-','T-', 'T-', 'T-', 'T-', 'T-', 'T-', 'T-','T-', 'T-', 'T-', 'T-', 'T-', 'T-', 'RC'],
  ['| ', 'PH', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', 'PU', ' |'],
  ['| ', '**', 'lc', 'b-', 'b-', 'rc', '**','lc', 'rc', '**', 'lc', 'b-', 'b-', 'b-','b-', 'b-', 'b-', 'rc', '**', 'lc', 'rc','**', 'lc', 'b-', 'b-', 'rc', '**', ' |'],
  ['| ', '**', 'i|', '  ', '  ', '|i', '**','i|', '|i', '**', 'i|', '  ', '  ', '  ','  ', '  ', '  ', '|i', '**', 'i|', '|i','**', 'i|', '  ', '  ', '|i', '**', ' |'],
  ['| ', '**', 'cr', 't-', 't-', 'cl', '**','i|', '|i', '**', 'cr', 't-', 't-', 't-','t-', 't-', 't-', 'cl', '**', 'i|', '|i','**', 'cr', 't-', 't-', 'cl', '**', ' |'],
  ['| ', '**', '**', '**', '**', '**', '**','i|', '|i', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', 'i|', '|i','**', '**', '**', '**', '**', '**', ' |'],
  ['| ', '**', 'lc', 'b-', 'b-', 'b-', 'b-','cl', 'cr', 'b-', 'b-', 'rc', '**', 'lc','rc', '**', 'lc', 'b-', 'b-', 'cl', 'cr','b-', 'b-', 'b-', 'b-', 'rc', '**', ' |'],
  ['| ', '**', 'cr', 't-', 't-', 't-', 't-','t-', 't-', 't-', 't-', 'cl', '**', 'i|','|i', '**', 'cr', 't-', 't-', 't-', 't-','t-', 't-', 't-', 't-', 'cl', '**', ' |'],
  ['| ', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', 'i|','|i', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', ' |'],
  ['CR', 'B-', 'SR', '**', 'lc', 'b-', 'b-','b-', 'rc', '**', 'lc', 'b-', 'b-', 'cl','cr', 'b-', 'b-', 'rc', '**', 'lc', 'b-','b-', 'b-', 'rc', '**', 'SL', 'B-', 'CL'],
  ['  ', '  ', '| ', '**', 'cr', 't-', 't-','t-', 'cl', '**', 'cr', 't-', 't-', 't-','t-', 't-', 't-', 'cl', '**', 'cr', 't-','t-', 't-', 'cl', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'lc', 'b-', 'b-','b-', 'rc', '**', 'SL', 'B-', '-E', '  ','  ', 'E-', 'B-', 'SR', '**', 'lc', 'b-','b-', 'b-', 'rc', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'cr', 't-', 't-','rc', '|i', '**', ' |', '  ', '  ', '  ','  ', '  ', '  ', '| ', '**', 'i|', 'lc','t-', 't-', 'cl', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', '**', '**', '**','i|', '|i', '**', ' |', '  ', '  ', '  ','GH', '  ', '  ', '| ', '**', 'i|', '|i','**', '**', '**', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'lc', 'rc', '**','i|', '|i', '**', ' |', '  ', '  ', '  ','  ', '  ', '  ', '| ', '**', 'i|', '|i','**', 'lc', 'rc', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'i|', '|i', '**','cr', 'cl', '**', 'RS', 'T-', 'T-', 'T-','T-', 'T-', 'T-', 'LS', '**', 'cr', 'cl','**', 'i|', '|i', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'i|', '|i', '**','**', '**', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', '**', '**','**', 'i|', '|i', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'i|', 'cr', 'b-','b-', 'rc', '**', 'lc', 'b-', 'b-', 'b-','b-', 'b-', 'b-', 'rc', '**', 'lc', 'b-','b-', 'cl', '|i', '**', ' |', '  ', '  '],
  ['T-', 'T-', 'LS', '**', 'i|', 'lc', 't-','t-', 'cl', '**', 'cr', 't-', 't-', 'rc','lc', 't-', 't-', 'cl', '**', 'cr', 't-','t-', 'rc', '|i', '**', 'RS', 'T-', 'T-'],
  ['**', '**', '**', '**', 'i|', '|i', '**','**', '**', '**', '**', '**', '**', 'i|','|i', '**', '**', '**', '**', '**', '**','**', 'i|', '|i', '**', '**', '**', '**'],
  ['B-', 'B-', 'SR', '**', 'i|', '|i', '**','lc', 'b-', 'b-', 'b-', 'rc', '**', 'i|','|i', '**', 'lc', 'b-', 'b-', 'b-', 'rc','**', 'i|', '|i', '**', 'SL', 'B-', 'B-'],
  ['  ', '  ', '| ', '**', 'cr', 'cl', '**','i|', 'lc', 't-', 't-', 'cl', '**', 'cr','cl', '**', 'cr', 't-', 't-', 'rc', '|i','**', 'cr', 'cl', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', '**', '**', '**','i|', '|i', '**', '**', '**', '**', '**','**', '**', '**', '**', '**', 'i|', '|i','**', '**', '**', '**', ' |', '  ', '  '],
  ['  ', '  ', '| ', '**', 'lc', 'rc', '**','i|', '|i', '**', 'lc', 'b-', 'b-', 'b-','b-', 'b-', 'b-', 'rc', '**', 'i|', '|i','**', 'lc', 'rc', '**', ' |', '  ', '  '],
  ['LC', 'T-', 'LS', '**', 'i|', '|i', '**','cr', 'cl', '**', 'cr', 't-', 't-', 'rc','lc', 't-', 't-', 'cl', '**', 'cr', 'cl','**', 'i|', '|i', '**', 'RS', 'T-', 'RC'],
  ['| ', '**', '**', '**', 'i|', '|i', '**','**', '**', '**', '**', '**', '**', 'i|','|i', '**', '**', '**', '**', '**', '**','**', 'i|', '|i', '**', '**', '**', ' |'],
  ['| ', '**', 'lc', 'b-', 'cl', 'cr', 'b-','b-', 'rc', '**', 'SL', 'SR', '**', 'i|','|i', '**', 'SL', 'SR', '**', 'lc', 'b-','b-', 'cl', 'cr', 'b-', 'rc', '**', ' |'],
  ['| ', '**', 'cr', 't-', 't-', 't-', 't-','t-', 'cl', '**', ' |', '| ', '**', 'cr','cl', '**', ' |', '| ', '**', 'cr', 't-','t-', 't-', 't-', 't-', 'cl', '**', ' |'],
  ['| ', 'PU', '**', '**', '**', '**', '**','**', '**', '**', ' |', '| ', '**', '**','**', '**', ' |', '| ', '**', '**', '**','**', '**', '**', '**', '**', 'PU', ' |'],
  ['CR', 'B-', 'B-', 'B-', 'B-', 'B-', 'B-','B-', 'B-', 'B-', 'CL', 'CR', 'B-', 'B-','B-', 'B-', 'CL', 'CR', 'B-', 'B-', 'B-','B-', 'B-', 'B-', 'B-', 'B-', 'B-', 'CL'],
];
