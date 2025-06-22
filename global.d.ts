import ka from "./messages/ka.json";
import ru from "./messages/ru.json";
import tk from "./messages/tk.json";

type Messages = typeof ka;

// ✅ Type assertion to enforce structure
const ruMessages: Messages = ru as Messages;
const tkMessages: Messages = tk as Messages;

declare global {
  interface IntlMessages extends Messages {}
}
