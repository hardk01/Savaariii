import Pagination from '@/components/elements/Pagination';

const Table = ({ bookings, handleNextPage, handlePreviousPage, totalPages, currentPage, setCurrentPage, handleEdit, handleDelete, }: any) => {

  // console.log(bookings, "Car Image");
  

  return (
    <div>
      <div style={{ top: "180px" }} className="card shadow-sm">
        <div className="card-body">

          <div className="table-responsive">
            <table className="table table-bordered   table-striped" style={{ marginTop: "100px" }}>
              <thead className="table__head">
                <tr className="winner__table">
                  <th>S/N</th>
                  <th><i className="fa fa-user" aria-hidden="true"></i>Name</th>
                  <th><i className="fa fa-map-marker" aria-hidden="true"></i> From</th>
                  <th><i className="fa fa-calendar-o" aria-hidden="true"></i> To</th>
                  <th><i className="fa fa-trophy" aria-hidden="true"></i> Price</th>
                  <th><i className="fa fa-trophy" aria-hidden="true"></i> Distance</th>
                  <th><i className="fa fa-trophy" aria-hidden="true"></i> Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any, index: number) => (
                  <tr key={index} className="winner__table">
                    <td>{index + 1}</td>
                    <td>{booking.car} <img src="https://batafestivepromo.bigcityexperience.com/assets/frontend/img/g_coin.png" className="coin" /></td>
                    <td>{booking.from}</td>
                    <td>{booking.to}</td>
                    <td>{booking.price}</td>
                    <th>{booking.distance} </th>
                    <th>
                      <div style={{ display: "flex", gap: "10px" }} className="card-button">
                        <button onClick={() => handleEdit(booking)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#70f46d" className="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zM12.5 1.5 14.5 3.5 13.5 4.5 11.5 2.5l1-1z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(booking._id)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ justifyContent: "end" }} className="d-flex">
            <Pagination
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
