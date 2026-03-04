import DynamicComponent from "@/components/DynamicComponent";
import PageServer from "@/components/PageServer";
import ExchangeDashboardMainServer from "@/components/ExchangeDashboardMain/ExchangeDashboardMainServer";
import ExchangeDashboardBankServer from "@/components/ExchangeDashboardBank/ExchangeDashboardBankServer";
import OrderConsultation from "@/components/OrderConsultation/OrderConsultation";
import SingleCurrencyTableServer from "@/components/SingleCurrencyTable/SingleCurrencyTableServer";
import ConverterServer from "@/components/Converter/ConverterServer";

// Server-only components that use next/headers (async server components).
// These cannot be imported in client components like Grid.
const serverComponents = {
  page: PageServer,
  ExchangeDashboardMain: ExchangeDashboardMainServer,
  ExchangeDashboardBank: ExchangeDashboardBankServer,
  OrderConsultation: OrderConsultation,
  SingleCurrencyTable: SingleCurrencyTableServer,
  Converter: ConverterServer,
};

export default function ServerDynamicComponent({ blok }) {
  if (!blok?.component) return null;
  const ServerComponent = serverComponents[blok.component];
  if (ServerComponent) return <ServerComponent blok={blok} />;
  return <DynamicComponent blok={blok} />;
}
