
import React, {Fragment} from 'react'


function useStateCallback(initialState) {
    const [state, setState] = React.useState(initialState);
    const cbRef = React.useRef(null);
  
    const setStateCallback = React.useCallback((state, cb) => {
      cbRef.current = cb; 
      setState(state);
    }, []);
  
    React.useEffect(() => {
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null;
      }
    }, [state]);
  
    return [state, setStateCallback];
  }

  export {useStateCallback}