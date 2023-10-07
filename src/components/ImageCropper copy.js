import React, { useState } from 'react';
import { CropperRef, Cropper } from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'

export const ImageCropper = () => {
    const [image, setImage] = useState(
        'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
    );

    const onChange = (cropper: CropperRef) => {
        console.log(cropper.getCoordinates(), cropper.getCanvas());
    };

    return (
        <Cropper
            style={{width:"50%",minWidth:"400px"}}
            canvas={false}
            src={image}
            onChange={onChange}
            className={'cropper'}
        />
    )
};