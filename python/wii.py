import cwiid
import time
import math

def count_rotations():
    # Connect to Wii Remote
    print("Press 1+2 on your Wii Remote now to connect...")
    time.sleep(1)
    try:
        wii = cwiid.Wiimote()
    except RuntimeError:
        print("Failed to connect to the Wii Remote. Please try again.")
        return

    # Enable motion sensing
    wii.rpt_mode = cwiid.RPT_MOTIONPLUS | cwiid.RPT_BTN

    # Initialize variables for rotation counting
    rotation_count = 0
    last_angle = None
    rotation_threshold = 15  # Adjust for sensitivity; lower values = more sensitive to rotation

    try:
        print("Counting rotations... Press 'Home' button on Wii Remote to quit.")
        while True:
            # Read the acceleration data (x, y, z)
            accel = wii.state['acc']
            ax, ay, az = accel

            # Calculate roll angle from acceleration data
            angle = math.degrees(math.atan2(ay, az))

            if last_angle is not None:
                # Check if there's a significant change in angle, indicating a rotation
                angle_diff = abs(angle - last_angle)
                if angle_diff > rotation_threshold:
                    rotation_count += 1
                    print(f"Rotation detected! Total rotations: {rotation_count}")

            last_angle = angle

            # Exit if the Home button is pressed
            if wii.state['buttons'] & cwiid.BTN_HOME:
                print("Exiting rotation counter.")
                break

            # Short delay for stability
            time.sleep(0.1)

    except KeyboardInterrupt:
        print("Interrupted by user.")

    finally:
        # Disconnect the Wii Remote
        wii.close()
        print(f"Total rotations counted: {rotation_count}")

if __name__ == "__main__":
    count_rotations()
