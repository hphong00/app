import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INotification, NewNotification } from '../notification.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INotification for edit and NewNotificationFormGroupInput for create.
 */
type NotificationFormGroupInput = INotification | PartialWithRequiredKeyOf<NewNotification>;

type NotificationFormDefaults = Pick<NewNotification, 'id' | 'isRead'>;

type NotificationFormGroupContent = {
  id: FormControl<INotification['id'] | NewNotification['id']>;
  userId: FormControl<INotification['userId']>;
  orderId: FormControl<INotification['orderId']>;
  message: FormControl<INotification['message']>;
  type: FormControl<INotification['type']>;
  isRead: FormControl<INotification['isRead']>;
};

export type NotificationFormGroup = FormGroup<NotificationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotificationFormService {
  createNotificationFormGroup(notification: NotificationFormGroupInput = { id: null }): NotificationFormGroup {
    const notificationRawValue = {
      ...this.getFormDefaults(),
      ...notification,
    };
    return new FormGroup<NotificationFormGroupContent>({
      id: new FormControl(
        { value: notificationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userId: new FormControl(notificationRawValue.userId),
      orderId: new FormControl(notificationRawValue.orderId),
      message: new FormControl(notificationRawValue.message),
      type: new FormControl(notificationRawValue.type),
      isRead: new FormControl(notificationRawValue.isRead),
    });
  }

  getNotification(form: NotificationFormGroup): INotification | NewNotification {
    return form.getRawValue() as INotification | NewNotification;
  }

  resetForm(form: NotificationFormGroup, notification: NotificationFormGroupInput): void {
    const notificationRawValue = { ...this.getFormDefaults(), ...notification };
    form.reset(
      {
        ...notificationRawValue,
        id: { value: notificationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NotificationFormDefaults {
    return {
      id: null,
      isRead: false,
    };
  }
}
