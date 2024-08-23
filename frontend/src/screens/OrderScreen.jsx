import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch, //helps us refetch data, so its not stale
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  //paypalDispatch: This function can be used to dispatch actions that modify the state of the PayPal script.

  useEffect(() => {
    //this is to basically load the paypal script
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        //is part of how you can dynamically load the PayPal JavaScript SDK into your application. This function is typically used when you want to configure or reset certain PayPal script options, such as setting the client-id and currency for the transactions.
        paypalDispatch({
          type: "resetOptions", //This resets the PayPal script's options, like setting the client-id and currency. This step is crucial when you need to change these parameters dynamically without reloading the entire page.
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
        //The next dispatch with setLoadingStatus sets the script's loading status to pending, indicating that the script is in the process of loading. This status is often used in your application to show a loading indicator or prevent users from interacting with PayPal buttons before the script is fully loaded.
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    //details come from paypal
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment Successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success("Payment Successful");
  // }

  function onError(err) {
    toast.error(err.message);
  }
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order Delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message} </Message>
  ) : (
    <>
      <h1>Order #{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city} {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
