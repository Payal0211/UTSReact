import React from 'react'
import { ReactComponent as LoadingSVG } from 'assets/svg/loading.svg';

export default function LogoLoader({visible}) {
  return (
    <div style={{
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999',
        display: 'flex',
        background: 'rgba(10, 0, 0, 0.6)',
        display: visible === true ?  "flex":'none',
        alignItems: "center",
        justifyContent: "center",
    }}>
        <LoadingSVG />
    </div>
  )
}
