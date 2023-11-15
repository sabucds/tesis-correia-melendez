import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

export default function UploadInfoForm() {
  const methods = useForm({
    defaultValues: {
      items: [
        { clients: '', locations: '', minimal_cost: '', maximum_cost: '' },
      ],
    },
  });
  const {
    register,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'items',
  });

  const formValidations: Record<string, { required: string }> = {
    clients: { required: 'required' },
    locations: { required: 'required' },
    minimal_cost: { required: 'required' },
    maximum_cost: { required: '' },
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 space-y-4">
        <h1 className="text-xl font-bold">
          Paso 2: Costo de asignación Localización-cliente
        </h1>
        {fields.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex flex-wrap">
              <div>
                <label className="block">Cliente</label>
                <input
                  name={`items.${index}.clients`}
                  {...register(
                    `items.${index}.clients`,
                    formValidations.clients
                  )}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Localización</label>
                <input
                  name={`items.${index}.locations`}
                  {...register(
                    `items.${index}.locations`,
                    formValidations.locations
                  )}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Costo mínimo</label>
                <input
                  name={`items.${index}.minimal_cost`}
                  {...register(
                    `items.${index}.minimal_cost`,
                    formValidations.minimal_cost
                  )}
                  type="number"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">
                  Costo máximo <span>(opcional)</span>
                </label>
                <input
                  name={`items.${index}.maximum_cost`}
                  {...register(
                    `items.${index}.maximum_cost`,
                    formValidations.maximum_cost
                  )}
                  type="number"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => append({ ...item })}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                +
              </button>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  -
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Siguiente
        </button>
      </form>
    </FormProvider>
  );
}
