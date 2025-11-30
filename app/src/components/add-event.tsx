import { Formik } from "formik";
import * as yup from 'yup';

type AddEventFieldType = {
  name: string;
  description: string | null;
  location: string;
  time: Date;
  invitees: string[];
};


const AddEvent = () => {
  const initialValues: AddEventFieldType = {
    name: '',
    description: null,
    location: '',
    time: new Date(),
    invitees: []
  };

  const validationSchema = yup.object({
    name: yup.string().required('Event name is required'),
    description: yup.string().nullable(),
    localtion: yup.string().required('Event location is required'),
    time: yup.date().required('Event date is required'),
    invitees: yup.array(yup.string()).min(1, 'Minimum 1 invitee is required')
  });

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={console.log}>
      {/* add event form */}
    </Formik>
  )
};

export default AddEvent;
