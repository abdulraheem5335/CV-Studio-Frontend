import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiCamera, FiCheck, FiX, FiAlertCircle,
  FiShield, FiLoader, FiImage, FiRefreshCw, FiGift
} from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NustIdVerification = ({ onVerified, onClose }) => {
  const [step, setStep] = useState('upload'); // upload, processing, result
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const fileInputRef = useRef(null);

  // Simulated OCR processing
  const simulateOCR = async (imageFile) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulated extracted data (in real app, this would come from OCR service)
    const simulatedResults = [
      { 
        success: true, 
        data: { 
          name: 'Muhammad Ali', 
          studentId: '321456', 
          department: 'SEECS', 
          batch: '2022',
          isValid: true 
        }
      },
      { 
        success: true, 
        data: { 
          name: 'Fatima Khan', 
          studentId: '321789', 
          department: 'NBS', 
          batch: '2023',
          isValid: true 
        }
      },
      { 
        success: false, 
        error: 'Could not read ID card. Please try again with a clearer image.' 
      },
      { 
        success: true, 
        data: { 
          name: 'Ahmed Hassan', 
          studentId: '320123', 
          department: 'SCME', 
          batch: '2021',
          isValid: true 
        }
      },
    ];

    // Return random result for simulation
    return simulatedResults[Math.floor(Math.random() * simulatedResults.length)];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    setStep('processing');
    setIsProcessing(true);

    try {
      // Simulate OCR processing
      const result = await simulateOCR(image);
      
      setVerificationResult(result);
      setStep('result');

      if (result.success && result.data.isValid) {
        // Call API to update user verification status
        try {
          await api.post('/auth/verify-nust-id', {
            studentId: result.data.studentId,
            name: result.data.name,
            department: result.data.department,
            batch: result.data.batch,
          });
        } catch (error) {
          console.log('API call skipped - demo mode');
        }
      }
    } catch (error) {
      setVerificationResult({ success: false, error: 'Verification failed. Please try again.' });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setImage(null);
    setImagePreview(null);
    setVerificationResult(null);
    setStep('upload');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-2xl border border-purple-500/30 w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <FiShield className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">NUST ID Verification</h2>
              <p className="text-sm text-white/70">Verify your student identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Instructions */}
                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <h3 className="text-purple-400 font-medium mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Upload a clear photo of your NUST student ID card</li>
                    <li>• Ensure all text is readable</li>
                    <li>• Front side of the card only</li>
                    <li>• Maximum file size: 5MB</li>
                  </ul>
                </div>

                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    imagePreview
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-purple-500/50 hover:bg-gray-800/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="ID Preview"
                        className="max-h-48 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                        <FiCheck />
                        Image uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="text-4xl text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-300 font-medium mb-2">
                        Click to upload your NUST ID
                      </p>
                      <p className="text-gray-500 text-sm">
                        or drag and drop
                      </p>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerify}
                    disabled={!image}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      image
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiShield />
                    Verify ID
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Processing */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-6"
                >
                  <FiLoader className="text-5xl text-purple-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Verifying your ID...
                </h3>
                <p className="text-gray-400">
                  This may take a few seconds
                </p>

                {/* Processing Steps */}
                <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
                  <ProcessingStep label="Uploading image" done={true} />
                  <ProcessingStep label="Analyzing document" done={false} active={true} />
                  <ProcessingStep label="Extracting information" done={false} />
                  <ProcessingStep label="Verifying data" done={false} />
                </div>
              </motion.div>
            )}

            {/* Step 3: Result */}
            {step === 'result' && verificationResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center py-6"
              >
                {verificationResult.success ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <FiCheck className="text-4xl text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Verification Successful!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Your NUST ID has been verified
                    </p>

                    {/* Extracted Data */}
                    <div className="bg-gray-800 rounded-xl p-4 text-left mb-6">
                      <h4 className="text-sm text-gray-400 mb-3">Extracted Information:</h4>
                      <div className="space-y-2">
                        <InfoRow label="Name" value={verificationResult.data.name} />
                        <InfoRow label="Student ID" value={verificationResult.data.studentId} />
                        <InfoRow label="Department" value={verificationResult.data.department} />
                        <InfoRow label="Batch" value={verificationResult.data.batch} />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                      <p className="text-amber-400 font-medium mb-2 flex items-center gap-2"><FiGift className="text-lg" /> Verification Rewards!</p>
                      <div className="flex justify-center gap-6 text-sm">
                        <span className="text-purple-400">+500 XP</span>
                        <span className="text-yellow-400">+200 Points</span>
                        <span className="text-green-400">Verified Badge</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onVerified?.(verificationResult.data);
                        onClose();
                      }}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl"
                    >
                      Continue
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <FiAlertCircle className="text-4xl text-red-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Verification Failed
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {verificationResult.error}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRetry}
                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center gap-2"
                      >
                        <FiRefreshCw />
                        Try Again
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper Components
const ProcessingStep = ({ label, done, active }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      done ? 'bg-green-500' : active ? 'bg-purple-500 animate-pulse' : 'bg-gray-700'
    }`}>
      {done && <FiCheck className="text-xs text-white" />}
      {active && <FiLoader className="text-xs text-white animate-spin" />}
    </div>
    <span className={`text-sm ${done ? 'text-green-400' : active ? 'text-white' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export default NustIdVerification;
