import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import {ButtonToolbar, InputGroup} from "react-bootstrap";

function App() {

  return (
      <div className="container">
        <div className="row header justify-content-center">
          [WIP] Best Steam Trading Card Games Finder
        </div>

        <div className="row">
          <div className="col-4 box">
            <Form.Select aria-label="Select Shop Region">

            </Form.Select>
          </div>
          <div className="col box">
            {/*Loading Bar (?)*/}
          </div>
          <div className="col-2 box">
            <Button className="btn-primary w-auto">Load Button</Button>
          </div>
        </div>
        {/*<div className="row">
          <div className="col box">
            <Form.Select aria-label="Select Profile">

            </Form.Select>
          </div>
          <div className="col-2 box">
            <Button className="btn-primary">New Profile</Button>
          </div>
          <div className="col-2 box">
            <Button className="btn-danger">Delete Profile</Button>
          </div>
        </div>
        <div className="row">
          <div className="col box">
            <Form>
              {['checkbox'].map((type) => (
                  <div key={`inline-${type}`} className="mb">
                    <Form.Check inline label="Purchased" name="gameStatusFilter" type={type} id={`inline-${type}-1`} />
                    <Form.Check inline label="Wishlisted" name="gameStatusFilter" type={type} id={`inline-${type}-2`} />
                    <Form.Check inline label="Ignored" name="gameStatusFilter" type={type} id={`inline-${type}-3`} />
                    <Form.Check inline label="None" name="gameStatusFilter" type={type} id={`inline-${type}-0`} />
                  </div>
              ))}
            </Form>
          </div>
        </div>*/}
        <div className="row">
          <div className="col box flex-nowrap">
            <InputGroup>
              <InputGroup.Text id="searchInput">🔎</InputGroup.Text>
              <Form.Control className="search-text-field"
                            id="searchInputTextField"
                            aria-describedby="searchInput" type="text"
                            placeholder="..."/>
              <Button className="btn-secondary" id={"searchInputClear"}
                      aria-describedby="searchInput">X</Button>
            </InputGroup>
          </div>
        </div>

        <div className="row">
          <Table className="">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">ID</th>
              <th scope="col">Cards</th>
              <th scope="col">Price</th>
              <th scope="col">Rating</th>
              <th scope="col">Status</th>
            </tr>
            </thead>
          </Table>
        </div>
      </div>
  )
}

export default App
