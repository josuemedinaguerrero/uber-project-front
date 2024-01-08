import { useEffect, useState } from "react";

import Button from "../components/Button";

import { urlServer } from "../utils/constants";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import axios from "axios";
import toast from "react-hot-toast";
import Input from "../components/Input";

const ConfigurationAdminPanel = () => {
  const [securityAlerts, setSecurityAlerts] = useState<{}[]>([]);
  const [availableTimes, setAvailableTimes] = useState<{}[]>([]);

  const { register, handleSubmit } = useForm<FieldValues>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await Promise.all([axios.get(`${urlServer}/security-alerts`), axios.get(`${urlServer}/available-times`)]);

      setSecurityAlerts(res?.[0].data || []);
      setAvailableTimes(res?.[1].data || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("security_alert", data?.security_alert);

      const res = await axios.post(`${urlServer}/security-alerts`, formData);

      if (res.data?.error) {
        throw new Error(res.data?.message);
      }

      toast.success(res.data?.message);
      setSecurityAlerts((prev) => [...prev, { ALERT_DESCRIPTION: data?.security_alert }]);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <div>
      <div className="w-full">
        <h2 className="text-center">ALERTAS DE SEGURIDAD</h2>
        {securityAlerts?.map((securityAlert: any, idx) => (
          <p key={idx}>{securityAlert?.ALERT_DESCRIPTION}</p>
        ))}
        <form className="w-full flex flex-col items-center gap-5 mt-5" onSubmit={handleSubmit(onSubmit)}>
          <Input register={register} placeholder="Escriba una alerta de seguridad" name="security_alert" />

          <Button text="Guardar" bgColor="bg-indigo-400" type="submit" />
        </form>
      </div>

      <div className="w-full mt-10">
        <h2 className="text-center">HORARIOS DISPONIBLES</h2>
        {availableTimes?.map((availableTime: any, idx) => (
          <p key={idx}>
            {availableTime?.DESCRIPTION} | {availableTime.TIMES?.split("-")?.[0]} - {availableTime.TIMES?.split("-")?.[1]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationAdminPanel;
