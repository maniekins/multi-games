import React, { FunctionComponent, useMemo } from 'react';
import './Render.css';
import Tile from './Models/Components/Tile';
import { usePlayer } from './Objects';
import getMap, { calculateStart } from './Map/getMap';
import { MapSettingsType, MapSizeType } from './types';
import TileModel, { TYPES } from './Models/Tile';
import setVision from './Map/setVision';
import { useGameContext } from '../../services/Game';
import { useNPC } from './Objects/TestNPC/useNPC';
import { DEFAULT_AMOUNT_OF_ROOMS, DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH } from '../../services/Game';
// type RenderProps = {};

export const customMapSize: MapSizeType = { height: DEFAULT_MAP_HEIGHT, width: DEFAULT_MAP_WIDTH };
export const customMapSettings: MapSettingsType = {
  amountOfRooms: DEFAULT_AMOUNT_OF_ROOMS,
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
  const { mapVision, mapWidth, mapHeight, amountOfRooms } = useGameContext();
  const mapSize = useMemo(() => ({ height: mapHeight, width: mapWidth }), [mapHeight, mapWidth]);
  const mapSettings = useMemo<MapSettingsType>(() => ({ amountOfRooms }), [amountOfRooms]);

  const generatedMap = useMemo(() => getMap({ mapSettings, mapSize }), [mapSettings, mapSize]);

  // Only for testing purposes, to see how the map looks like without any vision restrictions.
  // const generatedMap = useMemo(() => getMap({ mapSettings: customMapSettings, mapSize: customMapSize }), []);
  const player = usePlayer({
    map: generatedMap,
    modelSize: DEFAULT_MODELS_SIZE,
    startedLocation: calculateStart(generatedMap, mapSize),
  });

  const npc = useNPC({
    map: generatedMap,
    modelSize: DEFAULT_MODELS_SIZE,
    startedLocation: calculateStart(generatedMap, mapSize),
  });

  const renderMap = useMemo(() => {
    const calculactedForVision = mapVision > 0 ? (mapVision - 5 <= 0 ? mapVision : mapVision - 3) : 8;
    setVision(generatedMap, player.location, calculactedForVision);
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
      if (mapVision && player.location.positionY + mapVision >= mapSize.height) {
        rows = [];
        for (let i = 0; i < player.location.positionY + mapVision - mapSize.height; i++) {
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
      if (mapVision && player.location.positionX + mapVision >= mapSize.width) {
        afterColumn = [];
        for (let j = 0; j < player.location.positionX + mapVision - mapSize.width; j++) {
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
                const occupants: React.ReactNode[] = [];
                if (player.location.positionX === idx && player.location.positionY === idy) {
                  occupants.push(<React.Fragment key="player">{player.component}</React.Fragment>);
                }
                if (npc.location.positionX === idx && npc.location.positionY === idy) {
                  occupants.push(<React.Fragment key="npc">{npc.component}</React.Fragment>);
                }

                const occupantColumns = Math.ceil(Math.sqrt(Math.max(occupants.length, 1)));
                const occupantRows = Math.ceil(Math.max(occupants.length, 1) / occupantColumns);

                return (
                  <Tile
                    key={tile.id}
                    type={tile.type}
                    modelSize={DEFAULT_MODELS_SIZE}
                    visible={tile.visible}
                    visited={tile.visited}
                  >
                    {occupants.length > 1 ? (
                      <div
                        className="Render__occupants"
                        style={{
                          gridTemplateColumns: `repeat(${occupantColumns}, minmax(0, 1fr))`,
                          gridTemplateRows: `repeat(${occupantRows}, minmax(0, 1fr))`,
                        }}
                      >
                        {occupants}
                      </div>
                    ) : (
                      (occupants[0] ?? null)
                    )}
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
  }, [generatedMap, mapSize, mapVision, npc.component, npc.location, player.component, player.location]);
  return useMemo(() => <div className="Render">{renderMap}</div>, [renderMap]);
};

export default React.memo(Render);
