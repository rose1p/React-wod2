import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import SearchPage from './shop/SearchPage';
import ShopList from './shop/ShopList';
import ShopUpdate from './shop/ShopUpdate';
import LoginPage from './user/LoginPage';
import { delCookie, getCookie } from '../common';
import { useEffect } from 'react';
import HomePage from './HomePage';
import ShopInfo from './shop/ShopInfo';
import CartList from './shop/CartList';
import MyPage from './user/MyPage';
import OrderComplete from './order/OrderComplete';
import OrderList from './order/OrderList';
import AdminOrderList from './admin/OrderList';

const NaviPage = () => {
    const location = useLocation();
    const path = location.pathname;

    const uid = getCookie("uid");
    if (uid) sessionStorage.setItem("uid", uid);

    const onLogout = (e) => {
        e.preventDefault();
        if (window.confirm("로그아웃하시겠습니까?")) {
            sessionStorage.clear();
            delCookie("uid")
            window.location.href = "/";
        }
    }

    return (
        <>
            <Navbar expand="lg" bg="primary" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href="/">LOGO</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100%' }}
                            navbarScroll>
                            {/*관리자메뉴*/}
                            {sessionStorage.getItem("uid") === 'admin' &&
                                <>
                                    <Nav.Link href="/shop/search" className={path.indexOf('/shop/search') !== -1 && 'active'}>
                                        상품검색
                                    </Nav.Link>
                                    <Nav.Link href="/shop/list" className={path.indexOf('/shop/') !== -1 && 'active'}>
                                        상품관리
                                    </Nav.Link>
                                    <Nav.Link href="/admin/purchase" className={path.indexOf('/admin/') !== -1 && 'active'}>
                                        주문관리
                                    </Nav.Link>
                                </>
                            }
                            {/*사용자메뉴*/}
                            {(sessionStorage.getItem("uid") && sessionStorage.getItem("uid") !== 'admin') &&
                                <>
                                    <Nav.Link href="/order/list" className={path.indexOf('/order/') !== -1 && 'active'}>
                                        주문목록
                                    </Nav.Link>
                                    <Nav.Link href="/cart/list" className={path.indexOf('/cart/') !== -1 && 'active'}>
                                        장바구니
                                    </Nav.Link>
                                </>
                            }

                        </Nav>
                        <Nav>
                            {sessionStorage.getItem("uid") ?
                                <>
                                    <Nav.Link href="/mypage" className='active'>
                                        {sessionStorage.getItem("uid")}
                                    </Nav.Link>
                                    <Nav.Link href="/logout" onClick={onLogout}>
                                        로그아웃
                                    </Nav.Link>
                                </>
                                :
                                <Nav.Link href="/login" className={path.indexOf('/login') !== -1 && 'active'}>
                                    로그인
                                </Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Routes>
                <Route path="/shop/search" element={<SearchPage />} />
                <Route path="/shop/list" element={<ShopList />} />
                <Route path="/shop/update/:pid" element={<ShopUpdate />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/shop/info/:pid" element={<ShopInfo />} />
                <Route path="/cart/list" element={<CartList />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/order/complete/:oid" element={<OrderComplete />} />
                <Route path="/order/list" element={<OrderList />} />
                <Route path="/admin/purchase" element={<AdminOrderList />} />
            </Routes>
        </>
    )
}

export default NaviPage