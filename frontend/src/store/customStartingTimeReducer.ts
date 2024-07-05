const initialCustomStartingTime = {
    custom: false
}

const customStartingTimeReducer = (state:any = initialCustomStartingTime, action: any) => {
    switch(action.type){
        case "STARTING_TIME_TRUE":
            return { ...state, custom: true };
        case "STARTING_TIME_FALSE":
            return { ...state, custom: false };
        default: 
            return state
    }
}

export default customStartingTimeReducer;