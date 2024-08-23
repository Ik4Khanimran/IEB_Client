import React, { useEffect, useState, useRef } from 'react';
import Quagga from 'quagga';  // npm install quagga
import { Modal, Button } from 'react-bootstrap';
import '../../csspage/barcodescanner.css'; // Import the CSS file for styling


const BarcodeScanner = ({ show, handleClose, onBarcodeScanned }) => {
  const [isQuaggaRunning, setIsQuaggaRunning] = useState(false);
  const [processingBarcode, setProcessingBarcode] = useState(false);
  const scannerContainerRef = useRef(null);

  useEffect(() => {
    if (show && !isQuaggaRunning) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerContainerRef.current,
          constraints: {
            facingMode: "environment"
          },
        },
        decoder: {
          readers: [
            "code_128_reader", // Add Code 128 reader
            "code_39_reader"   // Add Code 39 reader
          ]
        },
        locate: true,
        locator: {
          halfSample: true,
          patchSize: "medium",
          willReadFrequently: true
        }
      }, function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
        setIsQuaggaRunning(true);
      });

      Quagga.onDetected((data) => {
        if (!processingBarcode) {
          setProcessingBarcode(true);
          const code = data.codeResult.code;
          console.log('Barcode detected and processed : [' + code + ']', data);
          handleClose();
          onBarcodeScanned(code); // Pass the scanned barcode value to the parent component
          setTimeout(() => {
            setProcessingBarcode(false);
          }, 1000);
        }
      });
    }

    return () => {
      if (isQuaggaRunning) {
        Quagga.stop();
        setIsQuaggaRunning(false);
      }
    };
  }, [show, handleClose, isQuaggaRunning, onBarcodeScanned, processingBarcode]);

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Barcode Scanner</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0" }}>
          <div ref={scannerContainerRef} className="scanner-container">
            {/* Horizontal line overlay */}
            <div className="scanner-overlay">
              <div className="horizontal-line"></div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BarcodeScanner;
