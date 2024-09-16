import React from 'react'

export default function FlexCenter({children, sx, className}){
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            ...sx
        }}
        className={className}
        >
            {children}
        </div>
    )
}