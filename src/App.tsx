import WindowedContainer, { useWindowedBoundaries } from "./WindowedContainer";
import "./App.css";
import { memo, useDeferredValue, useMemo } from "react";

const ITEM_HEIGHT = 35;

function MyListItem({ item, index }: any) {
  const { top, bottom } = useWindowedBoundaries();
  const itemTop = useMemo(() => index * ITEM_HEIGHT, []);
  const itemBottom = useMemo(() => index * ITEM_HEIGHT + ITEM_HEIGHT, []);

  const deferredListItem = useDeferredValue(`${item} ${index}`);

  if (itemBottom < top || itemTop > bottom) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        height: ITEM_HEIGHT,
        top: itemTop,
        left: 0,
        scrollBehavior: "smooth",
      }}
    >
      {deferredListItem}
    </div>
  );
}

const MemoMyListItem = memo(MyListItem);

function MyList() {
  const scrollContainerStyle = { height: listOfStuff.length * ITEM_HEIGHT };

  return (
    <div style={scrollContainerStyle}>
      {listOfStuff.map((item, index) => (
        <MemoMyListItem key={index} item={item} index={index} />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <WindowedContainer>
        <MyList />
      </WindowedContainer>
    </div>
  );
}

export default App;

const listOfStuff = Array(10000).fill("This is item");
