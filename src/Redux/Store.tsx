import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {AuthSlice} from "./Auth/AuthSlice";
import {AgencySlice} from "./Agency/AgencySlice";
import {OfficeSlice} from "./Offices/OfficesSlice";
import {OperatorSlice} from "./Operator/OperatorSlice";
import {UserSlice} from "./Users/UserSlice";
import {ParcelSlice} from "./Parcels/ParcelsSlice";
import {TagsSlice} from "./Tags/TagsSlice";
import {TransactionSlice} from "./Transaction/TransactionSlice";
import {SupportSlice} from "./Support/SupportSlice";
import {DashboardSlice} from "./Dashboard/DashboardSlice";

export const store = configureStore({
	reducer: {
		[AuthSlice.reducerPath]: AuthSlice.reducer,
		[AgencySlice.reducerPath]: AgencySlice.reducer,
		[OfficeSlice.reducerPath]: OfficeSlice.reducer,
		[OperatorSlice.reducerPath]: OperatorSlice.reducer,
		[UserSlice.reducerPath]: UserSlice.reducer,
		[ParcelSlice.reducerPath]: ParcelSlice.reducer,
		[TagsSlice.reducerPath]: TagsSlice.reducer,
		[TransactionSlice.reducerPath]: TransactionSlice.reducer,
		[SupportSlice.reducerPath]: SupportSlice.reducer,
		[DashboardSlice.reducerPath]: DashboardSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(AuthSlice.middleware).concat(AgencySlice.middleware).concat(OfficeSlice.middleware).concat(OperatorSlice.middleware).concat(UserSlice.middleware).concat(ParcelSlice.middleware).concat(TagsSlice.middleware).concat(TransactionSlice.middleware).concat(SupportSlice.middleware).concat(DashboardSlice.middleware),
});

setupListeners(store.dispatch);
