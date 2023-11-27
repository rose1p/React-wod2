import axios from 'axios';
import React, { useState } from 'react'
import { Form, Card, Row, Col, Button } from 'react-bootstrap'
import {setCookie} from "../../common.js";

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const [form, setForm] = useState({
        uid: '',
        upass: ''
    });
    const { uid, upass } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const res =await axios.post("/user/login", form);
        if(res.data===0) {
            alert("아이디가 존재하지 않습니다.");
        }else if(res.data===2){
            alert("비밀번호가 틀렸습니다.");
        }else {
            if(checked) {
                setCookie("uid", uid, 7);
            }
            sessionStorage.setItem("uid", uid);
            if(sessionStorage.getItem("target")) {
                window.location.href=sessionStorage.getItem("target");
            }else {
            window.location.href="/users/login";
            }
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>로그인</h1>
            <Row className='justify-content-center'>
                <Col md={6}>
                    <Card className='p-3'>
                        <form onSubmit={onSubmit}>
                            <Form.Control name="uid" value={uid} onChange={onChange}
                                placeholder='아이디' className='mb-2' />
                            <Form.Control name="upass" value={upass} onChange={onChange}
                                placeholder='비밀번호' className='mb-2' type='password' />
                            <Button className='w-100' type='submit'>로그인</Button>
                        </form>
                        <div className='mt-2 text-end'>
                            <input type='checkbox' onChange={(e)=>setChecked(true)} 
                            checked={checked}/>
                            <span>아이디 저장</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage