import React, { FunctionComponent, useMemo } from 'react';
import './Render.css';
import Tile from './Models/Components/Tile';
import { usePlayer } from './Objects';
import getMap, { calculateStart } from './Map/getMap';
import { MapSettingsType, MapSizeType } from './types';
import TileModel, { TYPES } from './Models/Tile';
import setVision from './Map/setVision';
import { useGameContext } from '../../services/Game';
// type RenderProps = {};

const customMapSize: MapSizeType = { height: 30, width: 60 };
export const customMapSettings: MapSettingsType = {
  amountOfRooms: 3,
  rooms: [
    { centerX: 27, centerY: 3, height: 3, width: 3 },
    { centerX: 8, centerY: 8, height: 3, width: 5 },
    { centerX: 18, centerY: 18, height: 6, width: 5 },
  ],
  water: [
    { centerX: 8, centerY: 8, height: 1, width: 2 },
    { centerX: 23, centerY: 21, height: 3, width: 8 },
  ],
};
const DEFAULT_MODELS_SIZE = 20;

const Render: FunctionComponent = () => {
  // think about add this to some context
  const { mapVision } = useGameContext();
  // const generatedMap = useMemo(() => getMap({ mapSettings: customMapSettings, mapSize: customMapSize }), []);

  const generatedMap = useMemo(() => getMap({ mapSize: customMapSize }), []);
  const player = usePlayer({
    map: generatedMap,
    modelSize: DEFAULT_MODELS_SIZE,
    startedLocation: calculateStart(generatedMap, customMapSize),
  });

  const renderMap = useMemo(() => {
    setVision(generatedMap, player.location, mapVision > 0 ? mapVision - 3 : 8);
    const beforeRow = () => {
      let rows = null;
      if (mapVision && player.location.positionY < mapVision) {
        rows = [];
        for (let i = 0; i < mapVision - player.location.positionY - 1; i++) {
          rows[i] = new Array(player.location.positionX + mapVision);
          for (let j = 0; j < mapVision * 2 - 1; j++) {
            rows[i][j] = new TileModel({ blocking: true, id: `beforeFog-${i}-${j}`, type: TYPES.FOG });
          }
        }
      }
      return rows?.map((row, id) => (
        <div className="Render-row" key={'bf' + id}>
          {row.map((tile) => (
            <Tile key={tile.id} type={tile.type} modelSize={DEFAULT_MODELS_SIZE}></Tile>
          ))}
        </div>
      ));
    };

    const afterRow = () => {
      let rows = null;
      if (mapVision && player.location.positionY + mapVision >= customMapSize.height) {
        rows = [];
        for (let i = 0; i < player.location.positionY + mapVision - customMapSize.height; i++) {
          rows[i] = new Array(player.location.positionX + mapVision);
          for (let j = 0; j < mapVision * 2 - 1; j++) {
            rows[i][j] = new TileModel({ blocking: true, id: `afterFog-${i}-${j}`, type: TYPES.FOG });
          }
        }
      }
      return rows?.map((row, id) => (
        <div className="Render-row" key={'bf' + id}>
          {row.map((tile) => (
            <Tile key={tile.id} type={tile.type} modelSize={DEFAULT_MODELS_SIZE}></Tile>
          ))}
        </div>
      ));
    };
    const bR = beforeRow();
    const aR = afterRow();
    const fromMap = generatedMap.map((row, idy) => {
      let beforeColumn;
      if (mapVision && player.location.positionX < mapVision) {
        beforeColumn = [];
        for (let j = 0; j < mapVision - player.location.positionX - 1; j++) {
          beforeColumn[j] = new TileModel({ blocking: true, id: `beforeColFog-${idy}-${j}`, type: TYPES.FOG });
        }
      }
      let afterColumn;
      if (mapVision && player.location.positionX + mapVision >= customMapSize.width) {
        afterColumn = [];
        for (let j = 0; j < player.location.positionX + mapVision - customMapSize.width; j++) {
          afterColumn[j] = new TileModel({ blocking: true, id: `afterColFog-${idy}-${j}`, type: TYPES.FOG });
        }
      }
      if (!mapVision || (player.location.positionY - mapVision < idy && player.location.positionY + mapVision > idy)) {
        return (
          <div className="Render-row" key={'map' + idy}>
            {beforeColumn &&
              beforeColumn.map((tile) => {
                return <Tile key={tile.id} type={tile.type} modelSize={DEFAULT_MODELS_SIZE}></Tile>;
              })}
            {row.map((tile, idx) => {
              if (
                !mapVision ||
                (player.location.positionX - mapVision < idx && player.location.positionX + mapVision > idx)
              ) {
                return (
                  <Tile
                    key={tile.id}
                    type={tile.type}
                    modelSize={DEFAULT_MODELS_SIZE}
                    visible={tile.visible}
                    visited={tile.visited}
                  >
                    {player.location.positionX === idx && player.location.positionY === idy ? player.component : null}
                  </Tile>
                );
              }
              return null;
            })}
            {afterColumn &&
              afterColumn.map((tile) => {
                return <Tile key={tile.id} type={tile.type} modelSize={DEFAULT_MODELS_SIZE}></Tile>;
              })}
          </div>
        );
      }
      return null;
    });
    return (
      <>
        {bR}
        {fromMap}
        {aR}
      </>
    );
  }, [generatedMap, mapVision, player.component, player.location]);
  return useMemo(() => <div className="Render">{renderMap}</div>, [renderMap]);
};

export default React.memo(Render);
