import React from 'react'
import { ReactComponent as D4 } from '../../assets/dices/d4.svg'
import { ReactComponent as D6 } from '../../assets/dices/d6.svg'
import { ReactComponent as D8 } from '../../assets/dices/d8.svg'
import { ReactComponent as D10 } from '../../assets/dices/d10.svg'
import { ReactComponent as D12 } from '../../assets/dices/d12.svg'
import { ReactComponent as D20 } from '../../assets/dices/d20.svg'
import { RollType } from '../../models/chat'

interface Props {
    type: RollType
    className?: string
    onClick?: Function
}

const Dice: React.FC<Props> = ({ type, ...props }) => {
    switch (type) {
        case RollType.D4:
            return <D4 {...props}/>
        case RollType.D6:
            return <D6 {...props}/>
        case RollType.D8:
            return <D8 {...props}/>
        case RollType.D10:
            return <D10 {...props}/>
        case RollType.D12:
            return <D12 {...props}/>
        case RollType.D20:
            return <D20 {...props}/>
        default:
            return null
    }
}

export default Dice