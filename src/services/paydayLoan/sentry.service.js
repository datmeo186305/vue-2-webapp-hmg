import * as Sentry from "@sentry/browser";
import _ from "lodash";

export class SentryService {
  /**
   * Custom Sentry.captureMessage
   * @param message
   * @param captureContext
   * @param relatePath
   * @param className
   * @param functionName
   * @param request
   * @param response
   * @author datnt
   * @since 0.0.9
   * @version 0.0.9
   */
  static captureMessage(
    message,
    captureContext,
    relatePath,
    className,
    functionName,
    request,
    response
  ) {
    let sentryMessage = `
      ${message} \t
      response: ${!_.isEmpty(response) ? JSON.stringify(response) : ""};  \t
      functionName: ${functionName || ""}; \t
      relatePath: ${relatePath || ""}; \t
      className: ${className || ""};
    `;
    return Sentry.captureMessage(sentryMessage, captureContext);
  }

  /**
   * Custom Sentry.captureException
   * @param exception
   * @param captureContext
   * @author datnt
   * @since 0.0.9
   * @version 0.0.9
   */
  static captureException(exception, captureContext) {
    return Sentry.captureException(exception, captureContext);
  }
}
