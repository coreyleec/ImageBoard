import type React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface RenderItemProps {
  item: any;
  index: number;
}
interface IPhoto {
  id: number;
  folder_id: number;
  u_id: string;
  url: string;
  thumbnail_url: string;
  name: string;
  creative: boolean;
  index: number;
  details: string;
  // collaborators: [ICollaborator];
  orientation: boolean;
  centered: boolean;
}

export interface ResponsiveGridProps {
  keyExtractor?: (item: any, index: number) => string;
  renderItem: ({ item, index }: RenderItemProps) => ReactNode;
  data: TileItem[];
  maxItemsPerColumn: number;
  scrollEventInterval?: number;
  virtualization?: boolean;
  virtualizedBufferFactor?: number;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  centered: undefined | string | number;
  showScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  setPhotos: React.Dispatch<React.SetStateAction< any[] | [IPhoto]>>;
  setCentered: React.Dispatch<React.SetStateAction< any | number>>;
  itemUnitHeight?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  FooterComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
  HeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
}

export interface TileItem {
  widthRatio?: number;
  heightRatio?: number;
  [key: string]: any;
  // isCenterX: number;
  // isCenterY: number;
}

export interface GridItem extends TileItem {
  top: number;
  left: number;
  right: number;
  xOffset:  number,
  width:  number;
  height: number;
  isCenterX: boolean;
  isCenterY: boolean;
}
