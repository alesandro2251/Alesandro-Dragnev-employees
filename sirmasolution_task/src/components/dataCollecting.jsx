import React, { useState } from "react";
import Papa from "papaparse";
import Table from "react-bootstrap/Table";
import { Col, Button, Form } from "react-bootstrap";

import "./dataCollecting.css";

const DataCollecting = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState("");

  const FileChange = (e) => {
    //Takes the name of the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      //Takes the format after spliting the 'text/{type of file} and checks if is 'Cvs'
      const fileExtension = inputFile?.type.split("/")[1];
      if (fileExtension !== "csv") {
        alert("Input csv file !");
      }
      setFile(inputFile);
    }
  };

  const ShowData = () => {
    //Parse the data in array
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
      },
    });
  };

  const empId = [];
  for (let i = 0; i < data.length - 1; i++) {
    empId.push(data[i].EmpID);
  }

  const daysFrom = [];
  for (let i = 0; i < data.length; i++) {
    daysFrom.push(data[i].DateFrom);
  }

  const daysTo = [];
  for (let i = 0; i < data.length; i++) {
    daysTo.push(data[i].DateTo);
  }

  const projects = [];
  for (let i = 0; i < data.length - 1; i++) {
    projects.push(data[i].ProjectID);
  }

  const daysWorked = [];
  for (let i = 0; i < daysFrom.length - 1; i++) {
    if (daysFrom[i] !== "" && daysTo[i] !== "") {
      const date = daysFrom[i].split("/").reverse();
      const date2 = daysTo[i].split("/").reverse();
      let dateTo = 0;

      if (date2.includes("NULL")) {
        dateTo = new Date();
      } else {
        dateTo = new Date(date2[0], date2[1], date2[2]);
      }

      const dateFrom = new Date(date[0], date[1], date[2]);
      const daysCounted = Math.round(
        (dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24)
      );
      daysWorked.push(daysCounted);
    }
  }

  return (
    <Col className="column g-0">
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload your CSV file</Form.Label>
        <Form.Control type="file" onChange={FileChange} accept=".csv" />
      </Form.Group>
      <Button
        className="button"
        variant="secondary"
        size="md"
        onClick={ShowData}
      >
        Show data
      </Button>
      <Table striped bordered hover variant="secondary">
        <thead>
          <tr>
            <th>Employee ID </th>
            <th>ProjectID</th>
            <th>DataFrom</th>
            <th>DataTo</th>
          </tr>
        </thead>
        {data.map((data, index) => (
          <tbody key={index}>
            <tr>
              <td>{data.EmpID}</td>
              <td>{data.ProjectID}</td>
              <td>{data.DateFrom}</td>
              <td>{data.DateTo === "NULL" ? "Today" : data.DateTo}</td>
            </tr>
          </tbody>
        ))}
      </Table>
      <Table striped bordered hover variant="secondary">
        <thead>
          <tr>
            <th>Employee Id</th>
            <th>ProjectID</th>
            <th>DaysWorked</th>
          </tr>
        </thead>
        {daysWorked.map((data, index) => (
          <tbody key={index}>
            <tr>
              <td># {empId[index]}</td>
              <td>{projects[index]}</td>
              <td>{data}</td>
            </tr>
          </tbody>
        ))}
      </Table>
    </Col>
  );
};

export default DataCollecting;
