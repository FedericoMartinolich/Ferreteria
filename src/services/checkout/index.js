import { registerPaymentProvider } from "./paymentProvider";
import { registerShippingProvider } from "./shippingProvider";
import { localPaymentProvider } from "./providers/localPaymentProvider";
import { externalPaymentProvider } from "./providers/externalPaymentProvider";
import { localShippingProvider } from "./providers/localShippingProvider";
import { externalShippingProvider } from "./providers/externalShippingProvider";

export function registerBuiltInProviders() {
  registerPaymentProvider(localPaymentProvider);
  registerPaymentProvider(externalPaymentProvider);
  registerShippingProvider(localShippingProvider);
  registerShippingProvider(externalShippingProvider);
}

export {
  getPaymentProviders,
  getPaymentProvider,
  getEnabledPaymentProviders,
} from "./paymentProvider";

export {
  getShippingProviders,
  getShippingProvider,
  getEnabledShippingProviders,
} from "./shippingProvider";

export {
  createOrder,
  getOrderById,
  getOrders,
  setPaymentStatus,
  setShippingStatus,
} from "./orders";