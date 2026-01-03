export type Listener = () => void;
export type SliceListener<Slice> = (slice: Slice, prevSlice: Slice) => void;
