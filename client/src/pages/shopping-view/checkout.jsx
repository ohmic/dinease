import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "@/store/shop/cart-slice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // function handleInitiatePayment() {
  //   if (cartItems.length === 0) {
  //     toast({
  //       title: "Your cart is empty. Please add items to proceed",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (currentSelectedAddress === null) {
  //     toast({
  //       title: "Please select one address to proceed.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const orderData = {
  //     userId: user?.id,
  //     cartId: cartItems?._id,
  //     cartItems: cartItems.items.map((singleCartItem) => ({
  //       productId: singleCartItem?.productId,
  //       title: singleCartItem?.title,
  //       image: singleCartItem?.image,
  //       price:
  //         singleCartItem?.salePrice > 0
  //           ? singleCartItem?.salePrice
  //           : singleCartItem?.price,
  //       quantity: singleCartItem?.quantity,
  //     })),
  //     addressInfo: {
  //       addressId: currentSelectedAddress?._id,
  //       address: currentSelectedAddress?.address,
  //       city: currentSelectedAddress?.city,
  //       pincode: currentSelectedAddress?.pincode,
  //       phone: currentSelectedAddress?.phone,
  //       notes: currentSelectedAddress?.notes,
  //     },
  //     orderStatus: "pending",
  //     paymentMethod: "online",
  //     paymentStatus: "pending",
  //     totalAmount: totalCartAmount,
  //     orderDate: new Date(),
  //     orderUpdateDate: new Date(),
  //     paymentId: "",
  //     payerId: "",
  //   };

  //   dispatch(createNewOrder(orderData)).then((data) => {
  //     if (data?.payload?.success) {
  //       setIsPaymemntStart(true);
  //     } else if (paymentMethod === "online") {
  //       // Online Payment: Initiate Razorpay flow
  //       fetch("/server/controllers/shop/order-controller", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ amount: totalCartAmount * 100 }), // Amount in paise
  //       })
  //         .then((res) => res.json())
  //         .then((order) => {
  //           const options = {
  //             key: "rzp_test_5GgeIx7JUwfqHu", // Replace with your Razorpay Test Key
  //             amount: order.amount,
  //             currency: "INR",
  //             name: "Your Store",
  //             description: "Purchase Transaction",
  //             order_id: order.id,
  //             handler: function (response) {
  //               // Verify payment
  //               fetch("/server/controllers/shop/order-controller", {
  //                 method: "POST",
  //                 headers: { "Content-Type": "application/json" },
  //                 body: JSON.stringify(response),
  //               })
  //                 .then((res) => res.json())
  //                 .then((verification) => {
  //                   if (verification.success) {
  //                     toast({ title: "Payment Successful & Order Placed" });
  //                     Navigate("/order-success");
  //                   } else {
  //                     toast({
  //                       title: "Payment Verification Failed",
  //                       variant: "destructive",
  //                     });
  //                   }
  //                 })
  //                 .catch((error) => {
  //                   console.error("Verification Error:", error);
  //                   toast({
  //                     title: "Error verifying payment",
  //                     variant: "destructive",
  //                   });
  //                 });
  //             },
  //             theme: { color: "#3399cc" },
  //           };

  //           const razorpay = new window.Razorpay(options);
  //           razorpay.open();
  //         })
  //         .catch((error) => {
  //           console.error("Order Creation Error:", error);
  //           toast({
  //             title: "Error creating Razorpay order",
  //             variant: "destructive",
  //           });
  //         });
  //     }
  //   });

  //   const handleSelectChange = (value) => {
  //     setPaymentMethod(value); // Updates payment method (COD or Online)
  //   };
  // }
  function handleInitiatePayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "online",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        console.log(data.payload, "data");
        setIsPaymemntStart(true);
        const { razorpayOrder, orderId } = data.payload;

        console.log(razorpayOrder, "razorpayOrder");
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: "rzp_test_GL5uNS5YpLVgHK", // Get this from Razorpay dashboard
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Dinease",
            description: "Test Transaction",
            order_id: razorpayOrder.id, // Use the order ID received from backend
            handler: async (response) => {
              // 🔹 Step 4: Verify Payment & Update Order in Backend
              const verifyRes = await axios.post(
                `${import.meta.env.VITE_API_URL}shop/order/verify-payment`,
                {
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }
              );

              if (verifyRes.data.success) {
                console.log(verifyRes.data, "verifyRes.data");
                toast({
                  title: "Order Placed Successfully",
                });
                dispatch(clearCart(user));
                Navigate("/order-success");
              } else {
                alert("Payment verification failed!");
              }
            },
            prefill: {
              name: "John Doe",
              email: "johndoe@example.com",
              contact: "9999999999",
            },
            theme: { color: "#3399cc" },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        };
      } else {
        setIsPaymemntStart(false);
        alert("Error creating order!");
        return;
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  const handleSelectChange = (value) => {
    setPaymentMethod(value); // Update state when a value is selected
  };

  function handleCodOrder() {
    console.log("handleCodOrder");
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "cashondelivery",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Order Placed Successfully",
        });

        dispatch(clearCart(user));
        Navigate("/order-success");
      }
    });
  }
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={cartItems} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹ {totalCartAmount}</span>
            </div>
          </div>
          <div>
            <p className="text-md mb-2">Choose Payment Method</p>
            <Select
              value={paymentMethod}
              onValueChange={(value) => handleSelectChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={paymentMethod || "Payment"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash On Delivery">
                  Cash On Delivery
                </SelectItem>
                <SelectItem value="Online Payment">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 w-full">
            {paymentMethod === "Cash On Delivery" && (
              <Button onClick={handleCodOrder} className="w-full">
                Place Order
              </Button>
            )}
            {paymentMethod === "Online Payment" && (
              <Button onClick={handleInitiatePayment} className="w-full">
                {isPaymentStart ? "Processing..." : "Pay Now"}
              </Button>
            )}
            {!paymentMethod && (
              <Button onClick={handleSelectChange} className="w-full" disabled>
                Select a Payment Method
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
