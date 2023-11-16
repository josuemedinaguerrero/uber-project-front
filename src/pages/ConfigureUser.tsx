import { useEffect, useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import toast from "react-hot-toast";

import { Driver, FieldClient, FieldDefaultClient, PaymentMethods, User } from "../types/types";
import { urlServer } from "../utils/constants";

import { useLocation, useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import axios from "axios";

type Session = User & Driver;

interface FieldsState {
  fieldsClient?: FieldClient[];
  defaultValues?: FieldDefaultClient;
  user: Session;
}

const ConfigureUser = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([]);

  const navigate = useNavigate();
  const location = useLocation().state as FieldsState | null;

  const { register, handleSubmit } = useForm<FieldValues>({ defaultValues: location?.defaultValues });

  useEffect(() => {
    if (!location) {
      navigate("/");
      return;
    }

    axios.get(`${urlServer}/payment-methods`).then((res) => setPaymentMethods(res.data));
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      const res = await axios.put(`${urlServer}/update-user`, formData);

      if (res.data?.error) {
        throw new Error(res.data?.message);
      }

      localStorage.setItem("user", JSON.stringify({ ...location?.user, numRandom: Math.random() }));
      toast.success(res?.data?.message);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="mt-5">
      <form className="w-full flex flex-col items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
        {location?.fieldsClient?.map(({ label, name, disabled }) => (
          <Input key={name} register={register} placeholder={label} disabled={disabled} name={name} />
        ))}

        {location?.user.ROL === "CLIENT" && paymentMethods?.length > 0 && (
          <div className="w-full flex gap-10">
            <label>Seleccione un método de pago:</label>
            <select {...register("PAYMENT_METHOD")} className="appearance-none flex px-10 py-1 rounded-md outline-none cursor-pointer">
              <option value="">Método de pago</option>
              {paymentMethods.map((paymentMethod) => (
                <option key={paymentMethod.id} value={paymentMethod.id} className="">
                  {paymentMethod.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button text="Guardar" bgColor="bg-indigo-400" type="submit" />
      </form>
    </div>
  );
};

export default ConfigureUser;
