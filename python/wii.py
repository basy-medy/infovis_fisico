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

    # Enable accelerometer, buttons, and MotionPlus if available
    wii.rpt_mode = cwiid.RPT_BTN | cwiid.RPT_ACC | cwiid.RPT_EXT

    # Check if MotionPlus is present
    if 'ext_type' in wii.state and wii.state['ext_type'] == cwiid.EXT_MOTIONPLUS:
        wii.enable(cwiid.FLAG_MOTIONPLUS)
        print("Wii MotionPlus enabled.")
    else:
        print("MotionPlus not detected. Proceeding with accelerometer data only.")

    # Initialize variables for rotation counting
    rotation_count = 0
    last_angle = None
    rotation_threshold = 15  # Adjust for sensitivity; lower values = more sensitive to rotation

    try:
        print("Counting rotations... Press 'Home' button on Wii Remote to quit.")
        while True:
            if 'acc' in wii.state:
                # Use accelerometer data (x, y, z)
                ax, ay, az = wii.state['acc']
                angle = math.degrees(math.atan2(ay, az))

                if last_angle is not None:
                    # Detect rotation from the angle change
                    angle_diff = abs(angle - last_angle)
                    if angle_diff > rotation_threshold:
                        rotation_count += 1
                        print(f"Rotation detected! Total rotations: {rotation_count}")

                last_angle = angle

            # If MotionPlus is active, use gyroscope data for finer rotation detection
            if 'motionplus' in wii.state:
                gyro = wii.state['motionplus']
                # Process the gyroscope data as needed (e.g., check rotation speed)
                # Here, you could implement more precise counting based on gyroscope rotation
                # Note: gyro['x'], gyro['y'], and gyro['z'] give rotation rates along each axis.

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
