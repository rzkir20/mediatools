interface HistoryItemConvert {
  id: string;
  name: string;
  fromExt: string;
  toExt: string;
  size: number;
  date: number;
}

type HistoryItem = {
  id: string;
  url: string;
  title: string;
  author?: string;
  cover: string;
  type: "Video" | "Music" | "Image";
  date: number;
};
