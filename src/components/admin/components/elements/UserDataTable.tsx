import React from 'react'

const UserDataTable = () => {
  return (
    <>
       <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-4">Active Projects</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Hours</th>
                    <th>Priority</th>
                    <th>Members</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {projects.map((proj, idx) => (
                    <tr key={idx}>
                      <td>{proj.name}</td>
                      <td>{proj.hours}</td>
                      <td>
                        <span className={`badge bg-${proj.priority === "High" ? "danger" : proj.priority === "Medium" ? "warning" : proj.priority === "Low" ? "info" : "success"}`}>
                          {proj.priority}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex">
                          {[1, 2, 3].map((_, i) => (
                            <img key={i} src="/avatar.png" className="rounded-circle me-1" style={{ width: '30px', height: '30px', border: '2px solid white', marginLeft: i !== 0 ? '-10px' : '0px' }} alt="Member" />
                          ))}
                          <span className="badge bg-primary rounded-pill ms-2">+5</span>
                        </div>
                      </td>
                      <td style={{ width: '200px' }}>
                        <div className="progress">
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${proj.progress}%` }}
                            aria-valuenow={proj.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            {proj.progress}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </>
  )
}

export default UserDataTable
