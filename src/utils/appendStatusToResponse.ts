import { SimplifiedGig } from "../interfaces/gigInterface";

type taggedGigs = {
  gigId: string;
  status: string;
};

//This "appends" statuses from the relation table to the actual server response
//I felt like this is logic that needs to be handled in the backend instead of the frontend

export const appendStatusToResponse = (
  taggedGigsArray: Array<taggedGigs>,
  simplifiedGigArray: Array<SimplifiedGig>
) => {
  taggedGigsArray.map((g: { gigId: string; status: string }) => {
    const entry = {
      status: g.status,
    };

    const index: number = simplifiedGigArray.findIndex(
      (item) => item.id === g.gigId
    );
    Object.assign(simplifiedGigArray[index], entry);
  });

  return simplifiedGigArray;
};
