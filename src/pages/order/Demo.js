import React, { useState, useEffect } from "react";
import "./tableCss.css";
import { apiCall, displayLog } from "../../common/common";

function Demo() {
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    getOrderList();
  }, []);
  const getOrderList = async () => {
    const reqBody = {
      type: 1,
    };
    const reqParams = {
      page: 1,
      limit: 1000000,
      sortby: 1,
      sortorder: "asc",
    };

    let res = await apiCall(
      "POST",
      "",
      "/admin/order/list-order",
      reqBody,
      {},
      reqParams
    );
    console.log("check API", res.data);
    // if (res.data.status == true) {
    //   console.log("check API", res.data);
    //   setLoading(false);
    //   if (res.data.data.modification.length > 0) {
    //     setModificationList(res.data.data.modification);
    //     setTotal(res.data.data?.total);
    //   }
    // } else if (res.data.status == false) {
    //   displayLog(0, res.data.message);
    // }
  };
  return (
    <table
      width="100%"
      bgcolor="#ededed"
      align="center"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style={{ tableLayout: "fixed", margin: "0 auto" }}
    >
      <tbody>
        <tr>
          <td align="left">
            <table
              className="table600"
              width="100%"
              align="center"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style={{ backgroundColor: "#ffffff", padding: "25px" }}
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      className="table600"
                      width="100%"
                      align="left"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <table
                              className="table708"
                              width="100%"
                              bgcolor="#ffffff"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                            >
                              <tr>
                                <td width="100%" valign="top">
                                  <h2
                                    style={{
                                      textAlign: "center",
                                      fontFamily: "calibri",
                                      fontSize: "40px",
                                    }}
                                  >
                                    Invoice
                                  </h2>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table
                                    className="table708"
                                    width="100%"
                                    bgcolor="#ffffff"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style={{ paddingBottom: "20px" }}
                                  >
                                    <tr>
                                      <td width="18%" valign="top">
                                        <img
                                          src="https://dreamlineordering.s3.us-west-2.amazonaws.com/application_logo/logo.png"
                                          alt="logo"
                                          width="180"
                                          height="auto"
                                        />
                                      </td>
                                      <td width="52%" valign="top">
                                        <table
                                          className="table708"
                                          width="100%"
                                          bgcolor="#ffffff"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td className="invInfoBss">
                                              Dreamline
                                              <br />
                                              14 Marphona Crescent,
                                              <br />
                                              Auckland 2105,
                                              <br />
                                              New Zealand
                                              <br />
                                              <a
                                                href="maito:Dreamline@mailinator.com ,"
                                                style={{
                                                  color: "#000",
                                                  textDecoration: "none",
                                                }}
                                              >
                                                Dreamline@mailinator.com,
                                              </a>
                                              <span>+12345678900</span>
                                            </td>
                                            <td width="30%" valign="top">
                                              <table width="100%">
                                                <tr>
                                                  <td
                                                    className="invInfoBss"
                                                    width="100%"
                                                  >
                                                    <b>Invoice Number:</b>
                                                    {/* <!-- <p style="margin-top: 0px;">
                                                      #{details['order_code']}
                                                    </p> --> */}
                                                    <p
                                                      style={{
                                                        marginTop: "0px",
                                                      }}
                                                    >
                                                      @replace_generated_order
                                                    </p>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td
                                                    className="invInfoBss"
                                                    width="100%"
                                                  >
                                                    <b>Invoice Date:</b>
                                                    {/* <!-- <p style={{marginTop: "0px"}}>
                                                      #{details['order_date']}
                                                    </p> --> */}
                                                    <p
                                                      style={{
                                                        marginTop: "0px",
                                                      }}
                                                    >
                                                      @replace_order_date
                                                    </p>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table
                                    className="table708"
                                    width="100%"
                                    bgcolor="#ffffff"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style={{ paddingBottom: "20px" }}
                                  >
                                    <tr>
                                      <td width="100%" valign="top">
                                        <table
                                          className="table708"
                                          width="100%"
                                          bgcolor="#ffffff"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tr>
                                            <td className="invInfoBss">
                                              <h3 style={{ margin: "0px" }}>
                                                <b>Bill To:</b>
                                              </h3>
                                            </td>
                                          </tr>
                                          <tr>
                                            {/* <!-- <td className="invInfoBss">
                                              #{details['therapist_name']}<br>
                                              #{details['therapist_address']}<br>
                                              #{details['therapist_email']},
                                              #{details['therapist_mobile']}
                                            </td> --> */}
                                            <td className="invInfoBss">
                                              @replacing_therapist_name
                                              <br />
                                              @replacing_therapist_address
                                              <br />
                                              @replacing_therapist_email,
                                              @replacing_therapist_mobile
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table
                                    className="table708"
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                  >
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table
                                            align=""
                                            cellpadding="0"
                                            cellspacing="0"
                                            border="0"
                                            width="100%"
                                            bgcolor="#ffffff"
                                            style={{
                                              border: "1px solid #ffffff",
                                              borderRadius: "0px",
                                            }}
                                          >
                                            <tbody>
                                              <tr>
                                                <td>
                                                  <table
                                                    className="table708"
                                                    width="100%"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    bgcolor="#ffffff"
                                                    border="0"
                                                    style={{
                                                      border:
                                                        "1px solid #ffffff",
                                                      borderRadius:
                                                        "0px 0px 4px 4px",
                                                    }}
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td>
                                                          <table
                                                            align=""
                                                            width="100%"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            border="0"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td>
                                                                  <table
                                                                    className="table708"
                                                                    width="100%"
                                                                    align=""
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    bgcolor="#ffffff"
                                                                    border="0"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td>
                                                                          <table
                                                                            align="center"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            border="0"
                                                                            width="100%"
                                                                          >
                                                                            <tbody>
                                                                              <tr
                                                                                style={{
                                                                                  backgroundColor:
                                                                                    "#f4f4f4",
                                                                                }}
                                                                              >
                                                                                <th
                                                                                  className="invRegg"
                                                                                  width="5%"
                                                                                  valign="middle"
                                                                                  height="25"
                                                                                  style={{
                                                                                    padding:
                                                                                      "8px",
                                                                                    borderBottom:
                                                                                      "1px solid #000000",
                                                                                    textAlign:
                                                                                      "right",
                                                                                    paddingRight:
                                                                                      "10px",
                                                                                  }}
                                                                                >
                                                                                  Item
                                                                                  no.
                                                                                </th>
                                                                                <th
                                                                                  className="invRegg"
                                                                                  width="30%"
                                                                                  valign="middle"
                                                                                  height="25"
                                                                                  style={{
                                                                                    padding:
                                                                                      "8px",
                                                                                    borderBottom:
                                                                                      "1px solid #000000",
                                                                                  }}
                                                                                >
                                                                                  Item
                                                                                  name
                                                                                </th>
                                                                                {/* <!-- <th className="invReggv" width='5%'
                                                                                  valign='middle' height='25'
                                                                                  style='padding: 8px; border-bottom: 1px solid #000000; text-align: right; padding-right: 10px;'>
                                                                                  Qty
                                                                                </th>
                                                                                <th className="invReggv" width='30%'
                                                                                  valign='middle' height='25'
                                                                                  style='padding: 8px; border-bottom: 1px solid #000000; text-align: right; padding-right: 10px;'>
                                                                                  Modification
                                                                                </th> --> */}
                                                                                <th
                                                                                  className="invReggv"
                                                                                  width="5%"
                                                                                  valign="middle"
                                                                                  height="25"
                                                                                  style={{
                                                                                    padding:
                                                                                      " 8px",
                                                                                    borderBottom:
                                                                                      "1px solid #000000",
                                                                                    textAlign:
                                                                                      "right",
                                                                                  }}
                                                                                >
                                                                                  Qty
                                                                                </th>
                                                                                <th
                                                                                  className="invReggv"
                                                                                  width="30%"
                                                                                  valign="middle"
                                                                                  height="25"
                                                                                  style={{
                                                                                    padding:
                                                                                      " 8px",
                                                                                    borderBottom:
                                                                                      "1px solid #000000",
                                                                                    textAlign:
                                                                                      "right",
                                                                                  }}
                                                                                >
                                                                                  Modification
                                                                                </th>
                                                                                <th
                                                                                  className="invReggr"
                                                                                  width="30%"
                                                                                  valign="middle"
                                                                                  height="25"
                                                                                  style={{
                                                                                    padding:
                                                                                      " 8px",
                                                                                    borderBottom:
                                                                                      "1px solid #000000",
                                                                                  }}
                                                                                >
                                                                                  Accessories
                                                                                </th>
                                                                              </tr>
                                                                              <tr>
                                                                                <td
                                                                                  style={{
                                                                                    padding:
                                                                                      " 8px",

                                                                                    textAlign:
                                                                                      "right",
                                                                                  }}
                                                                                >
                                                                                  1
                                                                                </td>
                                                                                <td>
                                                                                  Maria
                                                                                  Anders
                                                                                </td>
                                                                                <td>
                                                                                  Germany
                                                                                </td>
                                                                                <td
                                                                                  style={{
                                                                                    padding:
                                                                                      " 8px",

                                                                                    textAlign:
                                                                                      "right",
                                                                                  }}
                                                                                >
                                                                                  Maria
                                                                                  Anders
                                                                                </td>
                                                                                <td
                                                                                  style={{
                                                                                    padding:
                                                                                      " 8px",

                                                                                    textAlign:
                                                                                      "right",
                                                                                  }}
                                                                                >
                                                                                  Germany
                                                                                </td>
                                                                              </tr>
                                                                            </tbody>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default Demo;
