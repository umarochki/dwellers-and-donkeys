import React from 'react'
import Popover from '@material-ui/core/Popover'

interface Props {
    id: string
    icon: React.ReactElement
    controls: React.ReactElement
    onClick: Function
}

const MapControlWithPopover: React.FC<Props> = props => {
    const { id, icon, controls, onClick } = props
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const popoverId = open ? id : undefined

    const popoverIcon = React.cloneElement(
        icon,
        { onClick: (e: React.MouseEvent<HTMLButtonElement>) => { onClick(); handleClick(e) } }
    )

    return (
        <>
            {popoverIcon}
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {controls}
            </Popover>
        </>
    )
}

export default MapControlWithPopover