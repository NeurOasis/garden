import React from 'react';

const QuickReferenceCard = () => {
  // Card styling for a 4x6 landscape card (4" height x 6" width)
  const cardStyle = {
    width: '6in',
    height: '4in',
    padding: '0.2in',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    border: '1px solid #ccc',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  };

  // Navy blue color for headings
  const navyBlue = '#003366';

  return (
    <div style={cardStyle}>
      {/* Title */}
      <h1 style={{ 
        color: navyBlue, 
        textAlign: 'center', 
        margin: '0 0 0.1in 0', 
        fontSize: '0.22in',
        fontWeight: 'bold'
      }}>
        ACTIONS QUICK REFERENCE v1.3
      </h1>

      {/* Content Grid - 2 columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2.8in 2.6in', 
        gridGap: '0.1in',
        flex: 1
      }}>
        {/* Left Column */}
        <div>
          {/* Organization Levels */}
          <div style={{ marginBottom: '0.1in' }}>
            <h2 style={{ 
              color: navyBlue, 
              margin: '0 0 0.03in 0', 
              fontSize: '0.16in',
              fontWeight: 'bold',
              borderBottom: `1px solid ${navyBlue}`
            }}>
              ORGANIZATION LEVELS
            </h2>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>PROJECT</strong> → Collection of related actions
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>ACTION CARD</strong> → Single completable task
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>CHECKLIST</strong> → Step-by-step instructions
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>NOTES</strong> → Context and details
            </p>
          </div>

          {/* Lists Structure */}
          <div style={{ marginBottom: '0.1in' }}>
            <h2 style={{ 
              color: navyBlue, 
              margin: '0 0 0.03in 0', 
              fontSize: '0.16in',
              fontWeight: 'bold',
              borderBottom: `1px solid ${navyBlue}`
            }}>
              LISTS STRUCTURE
            </h2>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>INBOX</strong> → Capture all new thoughts
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>QUICK WINS</strong> → Simple, doable tasks
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>NEEDS BREAKING DOWN</strong> → Complex tasks
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>WAITING</strong> → Dependent on others
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>PROJECT LISTS</strong> → One per project
            </p>
          </div>

          {/* When Energy Is... */}
          <div>
            <h2 style={{ 
              color: navyBlue, 
              margin: '0 0 0.03in 0', 
              fontSize: '0.16in',
              fontWeight: 'bold',
              borderBottom: `1px solid ${navyBlue}`
            }}>
              WHEN ENERGY IS...
            </h2>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>LOW</strong>: Do Quick Wins
            </p>
            <p style={{ margin: '0.02in 0', fontSize: '0.13in' }}>
              <strong>HIGH</strong>: Process Inbox/break down complex items
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Shortcuts */}
          <div style={{ marginBottom: '0.1in' }}>
            <h2 style={{ 
              color: navyBlue, 
              margin: '0 0 0.03in 0', 
              fontSize: '0.16in',
              fontWeight: 'bold',
              borderBottom: `1px solid ${navyBlue}`
            }}>
              SHORTCUTS
            </h2>
            <ul style={{ 
              margin: '0.02in 0 0 0.15in', 
              paddingLeft: '0', 
              fontSize: '0.13in',
              listStyleType: 'none'
            }}>
              <li style={{ marginBottom: '0.02in' }}>• "?" = Don't understand yet</li>
              <li style={{ marginBottom: '0.02in' }}>• "big" = Complex project</li>
              <li style={{ marginBottom: '0.02in' }}>• [Location] or (Person) = Context</li>
              <li style={{ marginBottom: '0.02in' }}>• <strong>Temperature</strong> = Importance level</li>
              <li style={{ marginBottom: '0.02in' }}>• <strong>Due Date</strong> = Firm deadline</li>
              <li style={{ marginBottom: '0.02in' }}>• <strong>Task Date</strong> = Scheduled completion</li>
            </ul>
          </div>

          {/* Weekly Process */}
          <div style={{ marginBottom: '0.1in' }}>
            <h2 style={{ 
              color: navyBlue, 
              margin: '0 0 0.03in 0', 
              fontSize: '0.16in',
              fontWeight: 'bold',
              borderBottom: `1px solid ${navyBlue}`
            }}>
              WEEKLY PROCESS
            </h2>
            <ul style={{ 
              margin: '0.02in 0 0 0.15in', 
              paddingLeft: '0', 
              fontSize: '0.13in',
              listStyleType: 'disc'
            }}>
              <li>Review backlog (Inbox/Quick Wins)</li>
              <li>Assign Task Dates by priority</li>
              <li>Prioritize by Temperature/Due Dates</li>
            </ul>
          </div>

          {/* Remember */}
          <div style={{ 
            marginTop: '0.1in',
            padding: '0.1in',
            border: `1px dashed ${navyBlue}`,
            backgroundColor: '#f8f8f8'
          }}>
            <h2 style={{ 
              color: navyBlue, 
              margin: '0 0 0.03in 0', 
              fontSize: '0.16in',
              fontWeight: 'bold',
              borderBottom: `1px solid ${navyBlue}`,
              textAlign: 'center'
            }}>
              REMEMBER
            </h2>
            <p style={{ 
              margin: '0.05in 0 0 0', 
              fontSize: '0.14in', 
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Perfect organization ≠ getting things done
            </p>
            <p style={{ 
              margin: '0.03in 0 0 0', 
              fontSize: '0.14in', 
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Capture everything, organize minimally
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        fontSize: '0.1in', 
        color: '#666', 
        textAlign: 'right',
        marginTop: '0.05in'
      }}>
        QuickRef_Actions_Concise_20250510_v1.3
      </div>
    </div>
  );
};

export default QuickReferenceCard;