import cwiid
import time

def connect_wiimote():
    print("Press 1 + 2 on your Wii Remote now to connect...")
    try:
        wiimote = cwiid.Wiimote()
        wiimote.rpt_mode = cwiid.RPT_EXT  # Enable MotionPlus data if attached
        print("Wii Remote connected!")
        return wiimote
    except RuntimeError:
        print("Failed to connect to Wii Remote. Try again.")
        return None

def count_rotations(wiimote, threshold=20, duration=10):
    start_time = time.time()
    rotations = 0
    last_gyro_yaw = 0

    while time.time() - start_time < duration:
        if wiimote.state.get('ext_type') == cwiid.EXT_MOTIONPLUS:
            gyro = wiimote.state['motionplus']
            yaw_rate = gyro[cwiid.MOT_Y] - 512  # Adjust for zero rate bias
            
            # Detect a significant rotation
            if abs(yaw_rate - last_gyro_yaw) > threshold:
                rotations += 1
                print(f"Rotation detected! Total rotations: {rotations}")

            last_gyro_yaw = yaw_rate
            time.sleep(0.1)  # Adjust sample rate as needed

    print(f"Total rotations counted: {rotations}")
    return rotations

if __name__ == "__main__":
    wiimote = connect_wiimote()
    if wiimote:
        rotations = count_rotations(wiimote)
        print("Counting complete!")
        wiimote.close()
    else:
        print("Unable to connect to Wii Remote.")


