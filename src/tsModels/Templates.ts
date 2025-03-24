export interface SingleTemplate {
  backgroundUrl: string;
  productId: string[];
  stickerUrl: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  cardViewUrl: string;
  complete: boolean;
}
export interface ScratchCard {
  templateInfo: {
    _id: string;
    backgroundUrl: string;
    stickerUrl: string;
    productId: string[];
    createdAt: string;
    updatedAt: string;
  };
  customCardInfo: {
    cardBody: {
      fontStyle: string;
      fontSize: string;
      fontWeight: string;
      textAlignment: CanvasTextAlign | undefined;
      fontColor: string;
      text: string;
    };
    cardHeader: {
      fontStyle: string;
      fontSize: string;
      fontWeight: string;
      textAlignment: CanvasTextAlign | undefined;
      fontColor: string;
      text: string;
    };
    _id: string;
    listing_id: number;
    lastDate: string;
    complete: boolean;
    createdAt: string;
    updatedAt: string;
    cardViewUrl: string;
  };
}
