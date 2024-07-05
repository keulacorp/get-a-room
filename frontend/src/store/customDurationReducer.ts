const initialCustomDuration = {
    custom: false
}

const customDurationReducer = (state:any = initialCustomDuration, action: any) => {
    switch(action.type){
        case "DURATION_TRUE":
            return { ...state, custom: true };
        case "DURATION_FALSE":
            return { ...state, custom: false };
        default: 
            return state
    }
}

export default customDurationReducer;