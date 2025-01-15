import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import axios from "axios";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const { pathname } = useLocation();
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const sendOtp = (e, formData) => {
    e.preventDefault();
    const { mobile, email } = formData;
    if (
      mobile.length !== 10 ||
      isNaN(mobile) ||
      mobile === null ||
      mobile === undefined
    ) {
      toast({
        title: "Invalid mobile number",
        variant: "destructive",
      });
      return;
    }
    if (!email) {
      toast({
        title: "Email is required",
        variant: "destructive",
      });
    }
    axios
      .post(`/auth/send-otp`, { mobile, email })
      .then((res) => {
        if (res.data.status === "success") {
          setOtpSent(true);
          toast({
            title: "OTP sent successfully",
            variant: "default",
          });
        } else {
          toast({
            title: res.data.message,
            variant: "destructive",
          });
        }
      });
  };
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    console.log(otpSent, "otpSent");

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) => {
              const inputValue = event.target.value;
              const isNumber = getControlItem.type.toLowerCase() === "number";
              if (isNumber && inputValue.length > 10) {
                return;
              }
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              });
            }}
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      {!otpSent && pathname.split("/")[2] === "register" ? (
        <Button
          type="button"
          className="mt-2 w-full"
          onClick={(e) => sendOtp(e, formData)}
        >
          Send OTP
        </Button>
      ) : (
        <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
          {buttonText || "Submit"}
        </Button>
      )}
    </form>
  );
}

export default CommonForm;
