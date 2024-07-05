const initialCustomDuration = {
    custom: false
}

const customDurationReducer = (state:any = initialCustomDuration, action: any) => {
    switch(action.type){
        case "TRUE":
            return { ...state, custom: true };
        case "FALSE":
            return { ...state, custom: false };
        default: 
            return state
    }
}

export default customDurationReducer;