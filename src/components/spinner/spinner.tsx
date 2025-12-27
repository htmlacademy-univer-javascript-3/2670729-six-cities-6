const Spinner: React.FC = () => (
  <div className="spinner-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    width: '100%'
  }}
  >
    <div className="spinner" style={{
      width: '50px',
      height: '50px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4481c3',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  </div>
);

export default Spinner;

