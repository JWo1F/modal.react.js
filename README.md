# What is it?
`modal.react.js` is a library for creating smart
modal window with react way

# Installation
- `yarn add modal.react.js`
- `npm i --save modal.react.js`

# Modals holder area
You must use `<WrapperModal [global] />` to choose where to
place all modal windows, which can be placed on any
nesting inside the Wrapper.

Parameters:
- `global: boolean`: designate this component as global.
You can send modal windows from any context to the
global wrapper using `upsertModalGlobal` and
`deleteModalGlobal` anywhere in your code.

# The first level of abstraction
At this level, functions for updating and deleting
modal windows are implemented. These functions are
quite low-level and you can use them to write your
own functions and/or wrappers for modal windows.
For simple modal windows, see "second level of
abstraction".

## How to add or update a modal
If you want to place or update some modal window,
you need to call `useContext(ModalsContext).onUpsert(params)`
(or `upsertModalGlobal` if you use a global wrapper).

Parameters:
- `id: string` a unique (within one wrapper) id of
the modal window. Necessary for subsequent updating
of the modal window, as well as its deletion.
You can use `generateId` or `useStickyId` to generate a
random ID.
- `element: ReactNode` is react element, the modal
window itself, it will be drawn inside the div with
key equal to id.

## How to remove a modal
If you want to remove some modal window,
you need to call `useContext(ModalsContext).onDelete(id)`
(or `deleteModalGlobal` if you use a global wrapper).

# The second level of abstraction
Bindings to React components are implemented at this
level, as well as special hooks, with which it will
be easier and faster to implement unique modal windows.

## The concept of "anchor"
Anchor is the basis of the second level of abstraction.
It is a common React component that is only used to subscribe
to events and always returns null. Inside such an anchor you
can subscribe to `mount` and `unmount` events and make some
changes at that time (see the documentation for the first level).
The simplest implementation of an anchor is the Basic component.

## How to render a basic modal window
To show a simple modal window (the basic version does
not have any animations), you need to use an anchor
`<BasicModal>`. It does not take any additional parameters,
but to use special hooks, you will need to use a second
component inside. So, your code will normally look like this:
```jsx
<BasicModal>
  <YourOwnModalImplementation />
</BasicModal>
```

You also can use a simple decorator:
```jsx
wrapWithBasicModal(YourOwnModalImplementation);
```

## How to animate your own modal window
Inside the BasicModal anchor you can use a special hook
`useBasicModalUnmount(fn)`. The function that will be passed
inside will be called when the component is marked as "ready
for removal". The component itself will not be removed until
the function is called: the only argument for the function
you pass to `useBasicModalUnmount`.

Example usage:
```js
function YourOwnModalImplementation() {
  const [opacity, setOpacity] = useState(1);

  useBasicModalUnmount((unmount) => {
    // set opacity to 0
    setOpacity(0);
    
    // wait 500 ms and unmount this component
    setTimeout(unmount, 500);
  });
}
```

Also, inside the BasicModal anchor you can use the
`useFlowValue(delay: number, initial: any, live: any, unmount: any)`
hook, which can be used to animate very simple modal windows.

This hook takes several parameters:
- `delay: number` is the time it takes from the
"ready to remove" marking to the actual removal of the
component from the DOM. During this time all animations
must have had time to play.
- `initial: any` is the value that will be set when the
component first draws. As soon as the component is rendered,
this value will change to `live` and your component will be
redrawn.
- `live: any` is the value that will be set immediately after
the first rendering of your component. If you want to animate
transparency, for example, you should set initial = 0 and
live = 1, so that your component gets 0 first and then 1
immediately. Animation can be implemented either through JS,
or through CSS transition.
- `unmount: any` is the value that will be set as soon as
the "ready for deletion" mark is received. Your component
will receive this value for `delay` milliseconds, after which
your component will be removed from the DOM.

Example:
```js
const time = 500;

function YourOwnModalImplementation() {
  const opacity = useFlowValue(time, 0, 1, 0);
  
  const style = {
    opacity,
    transition: time + 'ms',
  };

  return <div style={style}>Content</div>;
}
```

## How to write your own global modal functions
If you have assigned one wrapper to be global, you can use
the `upsertModalGlobal` and `deleteModalGlobal` functions to
not depend on the React context. Using these functions,
you can show anything in the global wrapper.

Example:
```typescript jsx
async function alert(text: string) {
  const id = generateId();

  upsertModalGlobal({
    id,
    element: <AlertWindow text={text} />
  });
  
  await delay(500);

  deleteModalGlobal(id);
}
```

Also, you can use a little trick to get a response from
your component and return it from your function. To do this,
you need to use the usual Promise:
```typescript jsx
async function alert(text: string) {
  const id = generateId();

  try {
    const result = await new Promise<MyType>((resolve, reject) => {
      upsertModalGlobal({
        id,
        element: (
          <AlertWindow
            text={text}
            onClose={() => reject('closed')}
            onConfirm={(res) => resolve(res)}
          />
        )
      });
    });
    
    console.log(result); // value from onConfirm
    
    return result;
  } catch(err) {
    console.log(err); // 'closed'
    
    return err;
  } finally {
    deleteModalGlobal(id);
  }
}
```

The `showModal` function is implemented for easier
use of such functionality:

```typescript jsx
const alert = async (text: string) => (
  showModal<MyType>((resolve, reject) => (
    <AlertWindow
      text={text}
      onClose={() => reject('closed')}
      onConfirm={(res: MyType) => resolve(res)}
    />
  ))
);
```

You can also change the props for your element
(and replace it with another) using the same ID as the
first rendering of your element:

```typescript jsx
async function ticker() {
  const id = generateId();

  const render = (text: string) => {
    return <div>{text}</div>;
  };
  
  for(let i = 0; i < 10; i++) {
    upsertModalGlobal({
      id,
      element: render('Ticker: ' + i)
    });
    
    await delay(500);
  }
  
  // If you do not call this function, your modal
  // window will never be removed from the DOM.
  deleteModalGlobal(id);
}
```

## Subscribe to unmount inside your function
If you want to use advanced hooks `useBasicModalUnmount`
and `useFlowValue`, you need to define a
`BasicReverseCallbackContext` over your item.

You may also need a function to get Promise and its Resolve
function at the same time (in which case Promise will be
in Pending state until its Resolve function is called):

(or use `showModal`)

```typescript jsx
enum Result {
  confirmed,
  cancelled,
}

async function alert(text: string) {
  const id = generateId();
  const [onDelete, onDeletePromise] = createPromise<OnDeleteHandler>();

  const result = await new Promise<Result>((resolve) => {
    upsertModalGlobal({
      id,
      element: (
        <BasicReverseCallbackContext.Provider value={onDeletePromise}>
          <ConfirmWindow
            text={text}
            onCancel={() => resolve(Result.cancelled)}
            onConfirm={(res) => resolve(Result.confirmed)}
          />
        </BasicReverseCallbackContext.Provider>
      )
    });
  });
  
  // Mark your component as "ready to remove" and
  // remove the element from the page by calling
  // `deleteModalGlobal` right after the animation
  // inside your component is triggered (this is the
  // `unmount` function that you get inside
  // `useBasicModalUnmount`.

  onDeletePromise(() => {
    deleteModalGlobal(id);
  });
}

interface IConfirmWindowProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmWindow(props: IConfirmWindowProps) {
  // Now you can use useFlowValue hook here too
  // You also can use useBasicModalUnmount here
  const opacity = useFlowValue(500, 0, 1, 0);
  
  return <div style={{ opacity }} />;
}
```

### Exported utils functions
- `useBasicModalUnmount` to subscribe to an unmount event
- `useFlowValue` to use initial, live and unmount values
- `useIsFirstRender` to check is this first render
- `useStickyId` to set a unique id with React useRef
- `createPromise` to get Promise and its Resolve function at one call
- `delay: Promise` to delay some milliseconds
- `generateId` to generate random id (without React code)
- `wrapWithBasicModal` to wrap your component with Basic anchor

### Exported types
- `OnDeleteHandler` just an empty function
- `OnDeletePromise` is a `Promise<OnDeleteHandler>`
- `IModalState` is a `{id, element}` object

### Exported contexts
- `BasicReverseCallbackContext` for Basic hooks
- `ModalsContext` is context with `onUpsert` and `onDelete` functions