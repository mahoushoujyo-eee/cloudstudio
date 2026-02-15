import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ImageCropper.css';

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = () => {
    onCropComplete(croppedAreaPixels);
  };

  return (
    <div className="image-cropper-modal">
      <div className="image-cropper-overlay" onClick={onCancel}></div>
      <div className="image-cropper-content">
        <div className="image-cropper-header">
          <h3>裁剪课程封面</h3>
          <p>调整图片位置和大小，建议使用 16:9 比例</p>
        </div>
        
        <div className="image-cropper-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        <div className="image-cropper-controls">
          <div className="zoom-control">
            <label>缩放</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="image-cropper-actions">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="primary-btn" onClick={handleConfirm}>
            确认裁剪
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
