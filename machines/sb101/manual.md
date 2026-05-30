# ALPHA COMPACT
## Manual for Installation, Operation and Maintenance

**Original Instructions**

| | |
|---|---|
| Part number of documentation | 32708612 |
| Copyright | © Weber Marking Systems GmbH |
| Version | 14.12.12 /KWO |

**Weber Marking Systems GmbH**  
Maarweg 33  
D-53619 Rheinbreitbach  
E-Mail: info@webermarking.de  
http://www.webermarking.de

![Sources of Danger at Labeler](/machines/sb101/image001.png)

---

## Contents

1. [General Information](#1-general-information)
2. [Safety Regulations](#2-safety-regulations)
3. [Technical Specifications](#3-technical-specifications)
4. [Description of the Labeler](#4-description-of-the-labeler)
5. [Transport](#5-transport)
6. [Installation and Initial Operation](#6-installation-and-initial-operation)
7. [Operation](#7-operation)
8. [System Options](#8-system-options)
9. [Maintenance](#9-maintenance)
10. [Troubleshooting](#10-troubleshooting)
11. [Index](#11-index)
12. [EC-Declaration of Conformity](#12-ec-declaration-of-conformity)

---

## 1. General Information

### General Survey

Congratulations! You have purchased a high-quality labeling system. Our concern is to make sure that you profit from this system to your entire satisfaction over many years. In order to ensure this, we strongly recommend you to let our experienced specialists perform the installation. Please contact our Service-Hotline (see page 9). We are available from Mondays to Fridays 24 hours.

### Limitation of Liability

All pieces of information and notes of this manual have been arranged in consideration of applicable standards and regulations, state-of-the-art technology as well as our cognition and experiences over many years.

The manufacturer assumes no liability for damages caused by:
- Non-observance of this manual
- Non-observance of the intended use
- Use of unqualified personnel
- Manipulations at the system
- Use of spare parts that are not approved by the manufacturer

> The obligations of the supply contract, the General Trading Conditions as well as the Terms of Delivery of the manufacturer and the valid legal regulations at the moment of conclusion of a contract generally apply. Technical changes within the scope of improvement and development are subject to change without notice.

### Warranty Clause

> The warranty conditions are conform to the valid General Trading Conditions of Bluhm Systeme GmbH at the moment of purchase.

### Copyright Protection

> This documentation or parts of this documentation may only be copied, photocopied, reproduced or translated into other languages for personal use. Without previous expressed written permission of Bluhm Systeme GmbH a reproduction for circulation to a third party is not permitted.

### Purpose and Scope of this Operation Instruction

These operating instructions will help you get to know the system and use it properly. They contain important instructions for the user on how to use the system safely and correctly. Please comply with this information to avoid hazards, minimize repair costs and outages, and to increase the reliability and service life of the machine.

The operating instructions must always be available wherever the system is used. They must be read and used by everyone assigned to work with the system.

### Hints for Use of this Manual

- Keys and buttons which you must push appear in squared brackets. Example: Push **[Enter]** button to save changes.
- Procedures which should be followed in a specific order are listed in numbered paragraphs.
- Messages which appear on a controller display are shown in a text box.
- Figures and drawings are numbered serially in the particular chapter. For example "Fig. 2-1" is the first figure in chapter 2.

### Service Hotline

The technical Service-Hotline is available from Mondays to Fridays 24 hours. In urgent cases spare parts can be dispatched until approx. 22:00 p.m.

| | |
|---|---|
| **Tel** | +49 (0)2224 - 7708 - 440 |
| **Fax** | +49 (0)2224 - 7708 - 21 |
| **E-Mail** | hotline-ed@bluhmsysteme.com |

When contacting the hotline, please be prepared with:
- Detailed error description
- All information on the name plate of the labeler
- When did the error occur for the first time?
  - After loading new label material/ribbon?
  - After changes in the setup of the labeler?
- All information about the PLC signals in case of a failure of a print-apply cycle

### Explanation of Technical Terms

| Technical Term | Explanation |
|---|---|
| Adhesive Strings | Leaked adhesive at the label edge may adhere the label at the label liner. |
| Air Assist | A stream of air pushing against the bottom of the Tamp/blow box during label feed until label is fixed by vacuum. |
| Air Assist Tube | The air assist tube directs air assist by one or more drillings to the bottom side of the label. |
| Air Blast | The streams of air effusing from the Tamp drill holes during labeling to blow the label by air pressure onto the product. |
| Applying Cycle | An entire working sequence of the labeler from product detection to product labeling. |
| Application Mode | See explanations: Tamp On, Tamp Blow, Blow On and Wipe On. |
| Applicator | Description for label applicator respectively mimic that moves the tamp. |
| Blow-On | A contact free application mode in which the tamp takes the printed label by a stationary vacuum grid and applies with air pressure without moving the tamp. |
| Configuration Mode | Mode, where parameters for applicator configuration can be changed by display. |
| Conveying System | Complete unit consisting of conveyor belt and controller. |
| Dancer Arm | Arm, tensing the label web via spring tension. |
| Default | See factory setting. |
| DIP-Switches | DIP is the abbreviation for "Dual In-line Package". Tiny switches with 4 to 8 pins. |
| Display | Display providing information on status for the user. |
| EEPROM | Abbreviation for "Electrically Erasable Programmable Read-Only Memory". |
| Factory Setting | Comprises all basic adjustments of the system after manufacturing. |
| HMI | The user interface (HMI) is the place where the user comes into contact with the system. |
| Home Position | Basic or home position of the tamp at the peeler bar. |
| Label Feed | Feeding of a label. |
| Label Gap | Gap between two labels on the label web. |
| Label Liner | Siliconized liner paper that the labels are affixed. |
| Label Sensor | An optical sensor for identifying the label gap. |
| Peeler Bar | Metal edge of the applicator for peeling off the label. |
| PLC | Programmable logic controller. |
| PSI | The American measure of air pressure (Pounds per Square Inch Gauge). 1 bar = 14.7 PSI. |
| Rewinder | Roll holder for rewinding the label web. |
| Tamp | A unit which takes the label via vacuum and transfers it to the product where it is applied. |
| Tamp-Blow | Contact free application mode where the Tamp takes the label by vacuum, feeds it to the product and blows it on the product. |
| Tamp-On | Application mode where the Tamp takes on the label by a vacuum, feeding it and pressing it onto the product. |
| Trigger-Signal | Signal of a sensor or a PLC, activating the application cycle. |
| Vacuum Generator | Unit using air pressure for creating a vacuum. |
| Web | Label web consisting of a siliconized liner and adhering labels. |
| Wipe-On | Labeling mode where the label is peeled off by a peeler blade and directly transferred onto the product. |

---

## 2. Safety Regulations

### Behavior in Case of an Emergency

The operating personnel have to be familiar with the operation and the location of safety, accident notification, first aid and rescue devices.

**What to do in Case of an Emergency:**
- If persons or parts of the body or items are jammed in swing parts of the labeler, separate the labeler immediately from air pressure and power supply.
- Initiate immediately all required emergency measures for injured persons. Observe valid safety regulations in any case.
- Call medical attendance for injured persons.
- Eliminate all accident causes.

### General Safety Regulations

#### Explanation of Danger Degrees

| Symbol | Meaning |
|---|---|
| **DANGER** | Indicates a hazardous situation which, if not avoided, **will result in death or serious injury**. |
| **WARNING** | Indicates a hazardous situation which, if not avoided, **could result in death or serious injury**. |
| **CAUTION** | Indicates a hazardous situation which, if not avoided, **may result in minor or moderate injury**. |
| **NOTICE** | Indicates a hazardous situation which, if not avoided, **may result in damage to properties**. |

### Intended Use

An Intended Use applies if:
- The labeler is used exclusively for automatic labeling of moved respectively stopped products.
- Maintenance is only carried out after stopping the labeler.
- The labeler is used with specified products as well as specified labels.
- The labeler is operating in explosion-proof environments (not intended for explosion-risk areas).
- The labeler does not come in direct contact with food products.
- The labeler is not operating outdoors.
- The labeler is used exclusively for industrial purposes.
- All working conditions and instructions, prescribed in this manual, will be observed.
- Safety equipment is not by-passed or abrogated.
- Arbitrary changes at the machine are omitted.

### Reasonably Foreseeable Misuse

Any use other than defined in the "Intended Use" applies as not intended. The operator bears complete responsibility for damages caused by unintended use. Not intended uses include:
- Operation in explosive atmosphere
- The labeler comes in contact with food

### Retrofitting and Changes at the Labeling System

> **WARNING:** Unauthorized retrofitting and changes at the system lead to an immediate expiration of liability and warranty. Do not arrange any changes or amendments at the systems without consultation and written approval of the manufacturer.

### Sources of Danger at Labeler

The main danger zones include:
- **Rewinder** – Motor-powered; danger of being crushed (force limited to less than 50 N by round belt).
- **Peeler blade area** – Danger of crushing when the peeler bar swings out; protective plate provided.
- **Tamp forces** – Limited to 50 Newton for both movements of the stroke.
- **Air pressure** – The prescribed pressure may not be exceeded.

### Safety Instructions

> **⚡ DANGER TO LIFE!** Danger caused by direct or indirect contact with live parts.
> - Before performing any work on electrical equipment, separate from power source.
> - Work on electrical equipment may only be carried out by electricians.
> - To avoid static electricity, ground the labeling system.

> **🔥 FIRE DANGER!** Label web is highly combustible. Keep clear from naked flame and source of ignition.

> **⚙️ DANGER OF DRAWING IN!** Rotating elements at the labeler, rewinder, web brake and rollers. Do not grip in, at or between the moving parts.

> **⚠️ DANGER OF BEING CRUSHED!** At pivoted peeler blades the passing products push away the peeler blade. Maintain a distance from peeler blade, bracket of peeler blade, tamp pad and the products.

### Remaining Risks

The labeler is constructed for a safe operation. A certain amount of risk is always existent. Knowledge about remaining risks assists in arranging work safer and avoiding incidents.

### Warnings on the Labeler

Special hazards are identified with yellow stickers indicating:
- General danger
- Life-threatening hazard by electrical power
- Crushing hazard
- Entanglement hazard
- Hot surface danger
- Strong light radiation danger
- Observe manual

### Protection Device

**Machine cladding** – The fixed and screwed machine cladding (cover) protects the user from mechanical and electrical hazards.

### Authorized Personnel

- Only trained personnel are allowed to operate the labeler.
- Trainees/apprentices must be supervised by an experienced person.
- All work on electrical equipment must be carried out by skilled electricians only.
- Failures may be eliminated by authorized personnel only.

### Working Places Operator Personnel

The labeler is an automatic working apply system. The operator side is generally the system front side.

### Personal Protective Equipment

| Task | Protective Clothing | Safety Shoes | Safety Gloves | Protective Goggles |
|---|:---:|:---:|:---:|:---:|
| System Transport | X | X | X | |
| Setting up and connecting | X | X | | |
| Maintenance Work | X | X | | X |
| Labeling Mode | X | X | | |

### Disposal

This labeler complies with the RoHS EU-Regulation 2002/95/EG.

---

## 3. Technical Specifications

| Parameter | Value |
|---|---|
| **Dimensions (H × W × D)** | 715 × 310 × 590 mm (dependent on applicator version) |
| **Weight** | approx. 22 kg (without label roll) |
| **Power Connection** | 100–240V / 47–63Hz (1~) with protective conductor |
| **Power Consumption** | 200 W or 300 W (see type label) |
| **Environmental Temperature** | 10–38 °C |
| **Environmental Conditions** | 20–90% relative air humidity (non-condensing) |
| **Protection Rating** | IP 20 |
| **Air Pressure Connection** | 5–6 bar (according to DIN ISO 8573-1) |
| **Maximum Air Pressure Consumption** | Up to 200 l/min (0.3–3 Liter per applying cycle) |
| **Noise Level** | < 70 dB (A) |

### Information on Further Dimensions

| Parameter | Value |
|---|---|
| **Minimum Label Width** | 10 mm |
| **Maximum Label Width** | 120 mm or 150 mm (depending on version) |
| **Minimum Label Length** | 20 mm |
| **Maximum Label Length** | 300 mm |
| **Applying Distance (Tamp-Blow, Blow-Tamp-On)** | 0–20 mm (dependent on accuracy and label size) |
| **Label Roll Outside Diameter** | Ø = 300 mm (approx. 450 running meters); core = 76 mm (3") |

### Performance Data

| Parameter | Value |
|---|---|
| **Application Accuracy (Wipe-On and Tamp-On)** | +/- 0.8 mm |
| **Application Rate Wipe-On / Blow Box** | Up to 600 labels per min. |
| **Application Rate Tamp-On Applicators** | Up to 120 labels per min. |
| **Application Performance** | Max. 50 m per minute |

### Signal Connections

| Connection | Type |
|---|---|
| **Start-Connection (Trigger)** | PNP (Auxiliary voltage +24 Volt +/- 7%) |
| **Stop-Light Barrier** | NPN (forked light barrier) |

### Information on Operation

| Controller Type | Description |
|---|---|
| **Panel Controller** | 2 rotary and 4 push buttons |
| **Display Controller** | LCD with background lighting, 2-lines 16-digit, and 5 push buttons |

---

## 4. Description of the Labeler

### Application Field of the Labeler

The ALPHA Compact is used for the automatically labeling of products. Depending on machine attitude the labeling can be arranged on the sides or on the top face or the bottom side onto the product without any interruption. Depending on the application a lefthand (LH) or righthand (RH) version of the labeler is used.

### Function of the Labeler

The labels are unwound together with the label liner from a roll by a motor powered pair of draw rollers and pulled around a peel bar (peeler blade). Thereby the labels are peeled off the label liner and stuck on the passing product. The rest of the label liner is motor-driven rewound. This kind of label-application is called **Wipe-On** and is the standard applying mode.

### Application Modi

#### Wipe-On
The label is peeled off from peeler blade and applied onto the passing product. This is the **standard application mode** and does not require further mounting parts.

#### Tamp-Blow-Mode
The label is positioned by an optional applicator to a vacuum tamp and at triggering it is extended to the product and then blown off onto the product. Often used for contactless labeling – low-wear working method.

#### Tamp-On-Mode
The product is touched during labeling. The label is pushed onto the stopped product by the vacuum tamp. Requires a change of the applicator configuration.

#### Blow-On-Mode
The label is forwarded by an optional applicator with tamp by the vacuum and blown off onto the product without any movement of the stroke.

### Complete Overview of the Alpha Compact

| No. | Description |
|---|---|
| 1 | Cabinet with Controller |
| 2 | Connector |
| 3 | On/Off Switch (Option) |
| 4 | Unwinder |
| 5 | Unwinder Disc with Clamping |
| 6 | Dancer Arm for Unwinding |
| 7 | Dancer Arm for Rewinding |
| 8 | Rewinder |
| 9 | Feeding Unit (Friction Rollers) |
| 10 | Clamping Flange |
| 11 | Peeler Bar (Peeler Blade) |
| 12 | Label Sensor |
| 13 | Connectors |
| 14 | Belt Brake |

---

## 5. Transport

### Delivery

If the labeler is delivered by a carrier, check the packaging for damages. If anything is peculiar, please claim at the carrier and mark it on the delivery note.

**Scope of Delivery** – The scope of delivery depends on the ordered options and the customer's application. Control the scope of delivery when receiving the systems on the basis of the delivery note.

### Transport and Unpackaging

> **⚠️ DANGER!** Crashing weights may result in severe injuries or even in death! Do not move beneath the lifted weight.

> **⚠️ WARNING!** Straps are tensioned and may lash back uncontrolled when cut. Wear protective goggles and protective gloves. Stand laterally outside of the dangerous area.

**Required Resources:**
- Suitable means of transport (fork lift or pallet truck with a payload of at least 600 kg)
- 2 persons, who have to wear safety shoes
- Stable support for the labeler
- (Safety) steel band scissors for removal of the straps

**Transport Instruction:**

| Step | Procedure |
|---|---|
| 1 | Transport the labeler to its installation site (within a radius of 3m). |
| 2 | Remove foil packaging and straps (if available). |
| 3 | Remove all transportation safety device screws from rubber feet. |
| 4 | Lift the labeler with a double hand fork lift truck from the pallet. |
| 5 | Open the carton and remove packing material. |
| 6 | Lift the system with at least two persons out of the packaging. |
| 7 | Remove all transportation safety devices (marked red tie wraps). |

### Storage Conditions

**Storage Instruction:**

| Step | Procedure |
|---|---|
| 1 | Label material has to be removed from system. |
| 2 | Fix the labeler on pallet(s) and transport the system to its storage place. |
| 3 | For dust protection, cover the labeler with a cotton cloth or a paper towel. **Do not use foils** (condensate formation). |
| 4 | Before restarting the system, a check of the labeler is required. |

---

## 6. Installation and Initial Operation

### Installation

> **IMPORTANT:** The installation of the labeler must be made by a technician from the Bluhm Weber Group or examined by a final inspection. Damage based on incorrect installation represents no case of warranty.

#### Requirements to the Site of Installation
- Closed and clean room
- Level surface, solid floor (unevennesses must not exceed 5 mm)
- Floor with adequate carrying capacity: 1500 kg/m²
- Low vibration environment
- Adequate illuminating: 500 Lx
- No direct irradiation from sun light or heaters
- The machine must not operate in areas with electrostatic or magnetic fields
- Correct air and power supply according to "Technical Data"

#### Placing the Labeler
- The labeler may not contact the product
- Ensure sufficient access for user and service technician
- The mains switch/plug must always be freely accessible
- Use only the existing factory mounting points; **do not drill new mounting points**

#### Positioning the Labeler

The Alpha Compact has four possible fixing positions. Threads are M8 or M6 depending on order.
- Screws must be at least 8 mm deep into the thread
- Suitable screws: property class 8.8, tightening torque 18 Nm at M8 and 10 Nm at M6

### Connecting the Labeler

> **⚙️ DANGER OF DRAWING IN!** When working on the labeling system, disconnect from power supply.

> **⚠️ NOTICE:** The Alpha Compact can be connected to 100V up to 240V / 47–63 Hz. A false adjustment of the input-voltage leads to damage of the system and is **no case of warranty**.

**Connection to Supply Voltage:**

| Step | Procedure |
|---|---|
| 1 | Plug the power voltage cable of the system. |
| 2 | Connect the power voltage cable with supply voltage (standard 230 Volt socket). |

### Configuration Interfaces

#### (X2) Product Sensor 1
Connection via M12, 5-pin plug.

| PIN | Assignment |
|---|---|
| 1 | + 24V DC (Brown) |
| 2 | Not Used |
| 3 | GND (Blue) |
| 4 | Input Signal (Black) |
| 5 | Not Used |

#### Configuration Product Sensor Wenglor LD86PTC (Option)

| Flashing (Teach-Button) | NCC/NOC | Teach Mode |
|---|---|---|
| 1x | NOC | Normal Teach |
| 2x | NOC | Minimal Teach |
| 3x | NCC | Normal Teach |
| 4x | NCC | Minimal Teach |

**Teach Mode Setup:**

| Step | Procedure |
|---|---|
| 1 | Push the teach-button for 10 seconds until the LED changes from fast flashing to slow flashing. |
| 2 | Each pushing of the teach-button switches to the next teach-mode. |
| 3 | If the teach-button is not pushed for 15 seconds, the settings are saved. |

#### Product Sensor Positioning

**Instruction:**

| Step | Procedure |
|---|---|
| 1 | Place a product below tamp in the way that a label would be applied on the desired position. |
| 2 | Position the light barrier at the leading or trailing edge of the product. |
| 3 | Switch-on conveyor belt. |
| 4 | The labeler should be ready waiting for applying trigger. Let a product pass the labeler. |

#### Sensitivity Adjustment

**Instruction:**

| Step | Procedure |
|---|---|
| 1 | Place a product below tamp in the way that a label would be applied on the desired position. |
| 2 | Position the light barrier at the leading or trailing edge of the product. |
| 3 | Rotate the adjusting screw carefully clockwise up to mechanical stop. |
| 4 | Pay attention that the red LED (fouling message) does not switch on. |
| 5 | If the adjustment does not succeed, repeat from procedure 4. |
| 6 | Examine again the sensor fixing – must be absolutely tightened and vibrations-resistant. |
| 7 | (Light barrier only) Place a product between light barrier and reflector – the LED should go off. |
| 8 | When you place a product again in front of the light barrier, the LED has to switch off. |

#### (X3) Low Label (Option)
Connection via M12, 4-pin plug socket.

| PIN | Assignment |
|---|---|
| 1 | + 24V DC (Brown) |
| 2 | Not Used |
| 3 | GND (Blue) |
| 4 | Input Signal (Black) |

**Low Label Sensor Setup:**

| Step | Procedure |
|---|---|
| 1 | Turn the table disc so that the light beam of the sensor lights between the gaps. |
| 2 | Turn the headlights adjustment counter clockwise down until the label roll is not detected. |
| 3 | Turn the headlights adjustment clockwise approx. 1 rotation until the label roll is safely detected. |
| 4 | Loosen the adjustment screws with the hexagon socket wrench. |
| 5 | Adjust the sensor so that the light beam detects the label roll's end. |
| 6 | Tighten again the screw for adjustment clockwise. |

#### (X5) Encoder (Option)
Connection via M12, 5-pin plug.

| PIN | Assignment |
|---|---|
| 1 | + 24V DC (Brown) |
| 2 | Not Used |
| 3 | GND (Blue) |
| 4 | Input Signal (NPN or PNP depending on jumper position) |
| 5 | Not Used |

**Encoder Calculation:**

For standard encoder with 2000 pulses/rotation (article no. 33003611) and standard friction wheel 63.6 mm diameter (article no. 61801017):

```
Basic parameter = 799 × (Pulses per rotation / Friction wheel diameter)
               = 799 × (2000 / 63.6) = 25125

Programming 158 = Basic parameter / 256 = 098
Programming 159 = Basic parameter − (Value programming 158 × 256) = 037
```

#### (X6) Alarm Lamp (Option)
Connection via M12, 8-pin plug.

| PIN | Assignment |
|---|---|
| 1 | + 24V DC Red Lamp |
| 2 | + 24V DC Yellow Lamp |
| 3 | + 24V DC Green Lamp |
| 4 | Not Used |
| 5 | Ground (-) |

| Lamp | Description |
|---|---|
| Red (permanent light) | Flashes in case of system failure/error. Possible cause: label out or labeler error. |
| Yellow (permanent light) | Low Label Warning |
| Green (permanent light) | System ready (Ready Signal is set) |

#### (X7) Label Sensor

| PIN | Assignment |
|---|---|
| 1 | + 24V DC (Brown) |
| 2 | Not Used |
| 3 | GND (Blue) |
| 4 | Input Signal (Black) |

**Adjusting Label Sensor to Label:**

| Step | Procedure |
|---|---|
| 1 | Loosen both screws below the sensor bracket. |
| 2 | Move the sensor to desired position and tighten both screws again. |
| 3 | Arrange then a label calibration. |

**Scale Label Sensor to Label:**

| Step | Procedure |
|---|---|
| 1 | Push the teach-button for 2 seconds until the LED display flashes permanently. |
| 2 | Pass the label web through the forked light barrier within the next 2–8 seconds. At least 2 labels must be passed through. |
| 3 | After teach-action: 2x flashing = success; 4x flashing = not finished (repeat). |
| 4 | Make a label calibration (see Label Calibration section). |

> **NOTE:** If you push the teach-in button longer than 6 seconds, you will switch the light/dark detection (NO/NC) at the sensor. Push only for 2 seconds to scale the label.

#### (X8) Applicator (Option)
Connection via M12, 5-pin socket.

| PIN | Assignment |
|---|---|
| 1 | + 24V DC (Brown) |
| 2 | Not Used |
| 3 | GND (Blue) |
| 4 | Not Used |
| 5 | Network |

#### (X9) I/O (Option)

| PIN | Assignment |
|---|---|
| 1 | Output Signal: READY, (N.O.) Max: 200mA, Max. 30V |
| 2 | Output Signal: LOW LABEL WARNING (N.O.) Max. 200mA, Max. 30V |
| 3 | Output Signal: SYNC, (N.O.) Max: 200mA, Max. 30V |
| 4 | Input Signal: REMOTESTART Max. 10mA, LOW <3VDC, HIGH >15VDC |
| 5 | COM Input Signal |
| 6 | COM Output Signal |
| 7 | +24V (P24) |
| 8 | 0 V to Earth |

> **NOTE:** All outputs supplied via (P 24) must not consume together more than max. 500mA.

#### (X10) HMI

> **⚠️ NOTICE:** The labeler may be damaged when separating or connecting the HMI when the labeler is turned on. Separate or disconnect the HMI only in turned-off condition.

| PIN | Assignment |
|---|---|
| 1 | + 24V DC (Brown) |
| 2 | Not Used |
| 3 | GND (Blue) |
| 4 | Not Used |
| 5 | Network |

### Adjust Labeler to Label Liner Width

> **⚙️ DANGER OF DRAWING IN!** Disconnect labeler from power voltage when performing any work.

**Required equipment:** 2 mm Hexagon socket wrench

| Step | Procedure |
|---|---|
| 1 | Insert the label liner web in running direction between the guide rings to the web brake. |
| 2 | Move the outer guide ring until the label liner web has a clearance of approx. 0.1 mm to the guide rings. |
| 3 | Loosen the setscrew at the outer adjusting ring by turning counter clockwise. |
| 4 | Insert the label liner web between the adjusting rings of the dancer arm. Move the outer adjusting ring until clearance is approx. 0.1 mm. |
| 5 | Tighten again the setscrew at the outer adjusting ring by turning it clockwise. |
| 6 | Remove the label liner web. |

### Loading and Changing Label Material

> **⚙️ DANGER OF DRAWING IN!** Disconnect labeler from power voltage when performing any work.

> **⚠️ NOTICE:** The rewinder has a free-wheel. Do never turn the rewinder against rewind direction.

**Label Web Guiding for Wipe-On Mode – Loading Instruction:**

| Step | Procedure |
|---|---|
| 1 | If label web is still loaded, cut it in region of the peeler blade. |
| 2 | Open the clamp lever of the unwind disc and take it off. Remove any existing label roll. |
| 3 | Load the label roll onto the unwind mandrel, centered on the unwinder's axis. |
| 4 | Lay the label material around the deflection roller. |
| 5 | Lay the label material around the dancer arm roll and to front side. Release the web brake by pushing the dancer arm. |
| 6 | Set the unwind disc onto the unwind axis and push it at the label roll. |
| 7 | Fix unwind disc with clamp lever. |
| 8 | Guide the label material between web-leading-axis and web-leading-plate below the web brake. |
| 9 | Adjust the red web-leading-rings in a distance of < 1 mm to outer paper edge. |
| 10 | Release web brake with the clamp lever so the paper can be loaded easier. |
| 11 | Guide the label material below the upper leading roll to the peeler blade. |
| 12 | Guide the label material around the peeler blade. |
| 13 | Pass the label material above the lower leading roll back to the friction roll. |
| 14 | Remove all labels at the first 600 mm of the label web (from peeler blade) and put the label liner around the friction roll. |
| 15 | Guide the label liner via the friction roll to the rewinder. |
| 16 | If necessary remove the label liner roll at the rewind core. Fix the new loaded label material via web clamp U-shaped on the core. |
| 17 | Guide the label web to the rewind core and fix the new loaded label web via web clamp U-shaped on the core. |

### Dancer Arm Unwinder Setting

> **⚙️ DANGER OF DRAWING IN!** Disconnect the labeler from supply voltage when performing any work.

> **⚠️ WARNING:** The setting of the brake belt for the label unwinder may only be arranged by trained personnel!

**Instruction:**

| Step | Procedure |
|---|---|
| 1 | Dismantle the cover plate below the unwinder arm. Remove therefore the 5 screws. |
| 2 | Loosen the 2 screws slightly for clamping of the tension spring inside. |
| 3 | Move the adjustment to the tension spring inside slightly forward or backward depending on demand. |
| 4 | Tighten again the 2 screws for clamping. |
| 5 | Arrange several sample labelings to check the adjustment. |
| 6 | If the adjustment was successful, please mount again the cover plate. |

> **NOTE:** The dancer arm should in resting position also be slightly tensioned. Generally: the faster the feeding speed, the higher the spring power has to be.

### Label Calibration

The Alpha Compact provides a function to calibrate labels. After calibration, the label is located flush with the peeler bar.

**Calibration via Control Panel:**

| Step | Procedure |
|---|---|
| 1 | Push the **[Cal]** button. The labeler performs 3 applying cycles for calibration. Afterwards the leading edge of the label is flush to the peeler bar. |

**Calibration via Display Controller:**

| Step | Procedure |
|---|---|
| 1 | If not in starting mode, push the **[Start]** button. |
| 2 | Push the buttons **[▲]** + **[▼]** together at the same time. The labeler performs 3 applying cycles for the calibration. |

### Settings at Wipe-On System

> **⚙️ DANGER OF DRAWING IN!** Disconnect the labeler from supply voltage when performing any work.

**Instruction:**

| Step | Procedure |
|---|---|
| 1 | Put a product directly below the peeler bar. Conveying system must be switched off. |
| 2 | Loosen the screw of the roller holder and adjust the roller approx. to product height. (Note: longer labels always need a bigger distance of the pusher roller.) |
| 3 | Fix the screw and let a few products pass the labeler (without application) to check the adjustment. |
| 4 | Switch on the labeler at on/off switch. |
| 5 | Adjust the speed of label feed to the speed of products. |
| 6 | Make some test-applications and correct the application result if necessary. |

### Settings Coupling Rewinder

> **⚠️ NOTICE:** Never turn the rewinder against the rewinding direction. Do not push the dancer arm by force over its end position.

**Required equipment:** 2.5 mm and 3 mm hexagon socket wrench

| Step | Procedure |
|---|---|
| 1 | Loosen the setscrew. |
| 2 | Loosen the adjusting screw. |
| 3 | Push the dancer arm in direction of the adjustment (to the cover) and keep it pushed. |
| 4 | Tighten slightly the adjusting screw. |
| 5 | Release again the dancer arm. |
| 6 | Loosen the adjusting screw slightly until the dancer arm moves slowly backward by the spring force. |
| 7 | If the dancer arm achieves an angle of approx. 45 degrees to the cover, tighten again the adjusting screw. |
| 8 | Tighten then finally the setscrew again. |

### Air Assist Setup (with optional applicator)

> **⚠️ DANGER OF BEING CRUSHED!** Maintain a distance from applicator.

**Instruction:**

| Step | Procedure |
|---|---|
| 1 | Check if the air assist beam hits approx. 10 mm behind the leading edge of the tamp. |
| 2 | If adjustment is necessary, unscrew the counter nut, turn the tube into position, and arrest the nut again. |
| 3 | Push the **[ENTER]** button to feed a label. Regulate the air beam by the flow control valve. Turning clockwise = weakening. Turning counter clockwise = amplification. |
| 4 | Repeat until the label is pushed safely against the tamp pad. |

### Adjust Angle of Rotation at Optional Rotating Tamp

> **⚠️ DANGER OF BEING CRUSHED!** The movements of the applicator are driven by pneumatic cylinders.

**Required equipment:** 3 mm hexagon socket wrench, Screw driver G00

| Step | Procedure |
|---|---|
| 1 | Pull off the protective cap at the swing module. |
| 2 | Loosen the clamping screw to the 1st end position. |
| 3 | Adjust the end position so that the tamp is horizontally in home position and 1–2 mm more deeply than the peeler bar. |
| 4 | Tighten again the 1st end position. |
| 5 | Loosen the 2nd end position and adjust so that the rotating tamp is parallel to the product in extended position. |
| 6 | Tighten again the 2nd end position. |

---

## 7. Operation

### Safety Instructions

> **⚙️ DANGER OF DRAWING IN!** Do not grip in, at or between the moving parts. Switch the on/off switch to position "0" during work performance.

> **⚠️ DANGER OF BEING CRUSHED!** Remove manually or incorrectly applied labels only when you have control about the supply of products and there is no danger.

### Turn On and Off Labeler

**Without power supply:** The labeler is turned on and off by plugging in and out the power supply of the controller.

**With optional power supply:** Turned on and off by the power supply switch.

### Start Labeling Operation

**Requirements:**
- Initial operation was finalized successfully.
- Labeler is connected with air pressure, power, and labels are loaded.

| Step | Procedure |
|---|---|
| 1 | Connect labeler with supply voltage. The display will show: `ALPHA COMPACT.x  0000 / STAND-BY` |
| 2 | Pushing the **[Start]** button activates labeling mode. |

### Stop Labeling Operation

> **⚠️ WARNING:** When the system is stopped for several hours, you have to take the label material off the labeler. Label material gets bent in the area of the deflection rollers.

| Step | Procedure |
|---|---|
| 1 | Stop product supply. |
| 2 | Switch off labeler at power switch. |
| 3 | Remove manually or faulty applied labels. |
| 4 | Take label material off labeler. |

### Put System out of Operation

For shutdown of more than 4 weeks:

| Step | Procedure |
|---|---|
| 1 | Disconnect from power supply. |
| 2 | Transport system to storage location. |
| 3 | For dust protection cover labeler with a cotton cloth or a paper towel. |
| 4 | Air-condition storage location according to "Technical Specifications". |

### Operation of the HMI Panel

The HMI Panel consists of 4 buttons, 2 control dials and 2 control-LEDs.

| No. | Description | Specification |
|---|---|---|
| 1 | Potentiometer m/min | Adjusts the label applying speed (basic setting 0–50 m/min). |
| 2 | Potentiometer Adjust | 5 functions: 0=off, 1=Offset, 2=Trigger delay, 3=Sync pulse duration, 4=Sync pulse delay. |
| 3 | LED Run | Green LED – "ready for labeling". |
| 4 | LED Status | Orange LED – key lock for both potentiometers is turned on. |
| 5 | LED Stop | Red LED – labeler's standby status is interrupted. |
| 6 | **[Start]** button | Starts the labeler; activates labeling operation or acknowledges error messages. |
| 7 | **[Feed]** button | An application cycle is arranged by pushing this button. |
| 8 | **[Cal]** button | Aligns the label position in direction of the peeler bar (3 calibration cycles). |
| 9 | **[Stop]** button | Terminates the labeling operation; labeler changes to standby mode. |
| 7+8 | **[Feed]** + **[Cal]** simultaneously | Turns on or off the key lock for both potentiometers. |

### Operation of the HMI Display

The HMI Display consists of an LCD-Display and 5 buttons plus 2 control-LEDs.

| No. | Term | Description |
|---|---|---|
| 1 | Display | Various information is indicated in the display. |
| 2 | LED Start | Green LED flashing = "readiness for labeling". |
| 3 | **[Start]** button | Starts the labeler; activates labeling operation or resets failure messages. |
| 4 | **[▲]** / **[▼]** buttons | Navigation in menus; changing parameter values. |
| 5 | **[Enter]** key | JOG-function, calling up menus, changing/confirming parameters. |
| 6 | **[◄]** / **[►]** buttons | Navigation in menus; changing parameter values. |
| 7 | LED Stop | Red LED flashing = readiness for labeling interrupted. |
| 8 | **[Stop]** button | Terminates labeling operation; labeler changes to standby mode. |
| 3+5 | **[▲]** + **[▼]** + **[Cal]** simultaneously | Label position is aligned; 3 calibration cycles performed. |

### Program-Menus

Access menu modes by pushing buttons together in stand-by status:

| Key Combination | Menu |
|---|---|
| **[▲]** + **[Enter]** | FUNCTION-MENU |
| **[Enter]** + **[▼]** | CONFIGURATION-MODE |
| **[▲]** + **[▼]** | PROGRAMMING-MODE *(qualified personnel only)* |

**Display Explanation:**
```
ALPHA.03       0884
C=0 004.3  03.6   50.0
```
- Top left: Firmware version
- Top right: Label counter
- Bottom line: Status | Label length (cm) | Label position to sensor (cm) | Application rate (m/min)

### FUNCTION-MENU

#### LABEL COUNTER
Set a countdown value between 0–25599. Labeler stops automatically when "-0000" is reached.

#### RESET LABEL COUNTER
Resets the counter reading to "00000".

#### LCD-SETTING
- **LANGUAGE SELECTION** – Selects the menu language
- **LCD LIGHTNESS** – Lightness of the backlight (001–040)
- **LCD CONTRAST** – Contrast setting (001–100)

#### EVENT COUNTER

| Event | Counter Information |
|---|---|
| E00 | Number of all stopped applying cycles without failures |
| E01–E22 | Number of failures of certain error code |
| EV1 | Number of printed labels |
| EV2 | Number of all extension movements of the cylinder |
| EV3 | Number of blow off events |
| EV4 | Number of all communication failures |
| EV5 | Maintenance counter (increases by 1 after 256 applying cycles) |

#### SAVE CONFIGURATION
The Alpha Compact can store up to 9 different configurations for fast product changes.

#### LOAD CONFIGURATION
Previously saved configurations can be loaded and activated.

### CONFIGURATION-Menu

Access by pushing **[Enter]** and **[▼]** at the same time in stand-by.

**Password:** "123" (valid until 2x [Stop] pushed or labeler switched off and on)

| Address | Parameter | Description |
|---|---|---|
| 001 | LABEL LENGTH | Label length with gap (manual or auto calibration) |
| 002 | LABEL POSITION | Label position to the peeler bar |
| 003 | SPEED | Application rate (m/min) |
| 004 | LABEL OPTIONS | Acceleration ramp and additional functions |
| 005 | LABEL QUEUE | Number of labels between peeler bar and label sensor |
| 006 | LABELS BURST | Number of label applications per start signal |
| 007 | LABEL TRIGGER | Sensor input and signal type for start signal |
| 008 | TRIGGER DELAY | Delay between trigger and label application (0–255 mm) |
| 009 | TRIGGER BLANK | Debouncing for start trigger |
| 010 | SYNC PULSE TIME | Duration of synchronization output signal (1–255 ms) |
| 011 | SYNC PULSE DELAY | Delay of synchronization output signal after labeling |
| 012 | CALIBRATE LABEL | Automatic label calibration |
| 013 | VACUUM LEVEL | Threshold for label presence detection on tamp (0–10) |
| 014 | VACUUM TIMEOUT | Max. time to detect label presence before error (default 200 = 2 sec) |
| 015 | APPLIC-TRIGGER | Trigger signal for extension of the applicator |
| 016 | EXTENSION DELAY | Delay between trigger signal and actual tamp movement |
| 017 | EXTENSION TIME | Time from stroke movement start to blow-action start |
| 018 | TIME OUT VARIABLE STROKE | Max. waiting time for variable stroke sensor |
| 019 | BLOW TRIGGER | Trigger signal for blow-off of a label |
| 020 | BLOW DELAY | Delay of the blow-off |
| 021 | BLOW TIME | Duration of blow-off valve activation (10–255 ms) |
| 022 | HOME TIMEOUT | Max. time applicator waits for home position signal |
| 023 | BARCODE READ TIME | Max. time applicator waits for barcode reader signal |
| 024 | CYCLE OPTION | Pre-defined program processes |

#### 004 LABEL OPTIONS – Parameter Values

| Parameter | Function |
|---|---|
| 000 | Acceleration ramp 2G |
| +1 | Acceleration ramp 3G |
| +2 | Acceleration ramp 4G |
| +3 | Acceleration ramp 5G |
| +4 | Doubles the braking ramp |
| +32 | Selects the pneumatic peeler blade |
| +64 | Selects the optional connected rotary shaft encoder |
| +128 | Selects the trailing edge as reference edge |

#### 007 LABEL TRIGGER – Parameter Values

| Parameter | Function |
|---|---|
| 000 | Application starts as soon as labeler is ready |
| 001 | First (primary) product sensor input |
| 002 | Second (secondary) product sensor input |
| +4 | Input level (not switching edge) – enables multiple labeling |
| +8 | Start signal only accepted after terminated applying cycle |
| +16 | Selects leading edge as starting signal |
| +32 | Enables NPN sensor as start signal-sensor |

#### 024 CYCLE OPTION – Parameter Values

| Parameter | Function |
|---|---|
| +1 | Deactivates timeout "variable stroke"; generates error if label lost during tamp movement |
| +2 | Delays tamp retract at end of blow-off sequence |
| +4 | Deactivates timeout "variable stroke"; ignores vacuum loss during tamp movement |
| +8 | Activates corner wrap application for 90°–180° rotating tamp |
| +16 | Activates vacuum/"label on pad" query after label transfer in Tamp-On mode |
| +32 | Activates function for control of RFID reject unit |
| +64 | Deactivates error "timeout label" (useful to switch off vacuum check) |
| +128 | Deactivates timeout-error in case of variable stroke |

### PROGRAMMING Mode

> **⚠️ WARNING:** Wrong parameters can lead to bugs and improper functions, also possibly leading to mechanical damage. Programming should only be edited by authorized and trained personnel.

Access from stand-by by pushing **[▲]** and **[▼]** simultaneously.

**Password for Programming:** "01234"

#### TRANSMIT PARAMETERS
Sends configuration parameters to an external PC linked to the USB port.

#### RECEIVE PARAMETERS
Sets machine in waiting condition to receive configuration parameters from external PC.

#### RESET PARAMETER
Resets operating parameters to default values. Can also be activated at switch-on by pressing **[Start]** + **[Stop]** simultaneously for at least 5 seconds.

#### STORE PARAMETERS
Customizes the default parameter set. Requires 5-digit password. Correct execution confirmed by a single "beep".

### Firmware History

| Version | Date | Notes |
|---|---|---|
| Alpha 01 | 27 December 2010 | Prototype |
| Alpha 01a | 27 January 2011 | Prototype |
| Alpha 01b | 29 March 2011 | Prototype |
| Alpha 02 | 04 April 2011 | Prototype |
| Alpha 03 | 27 May 2011 | Prototype |
| Alpha 03a | 11 June 2011 | |
| Alpha 03b | 25 August 2011 | |
| Alpha 03c | 17 November 2011 | |
| Alpha 04 | 02 December 2011 | 9 configurations, first applicators supported |
| Alpha 04a | 07 February 2012 | Minor improvement of error diagnosis |
| Alpha 04b | 14 February 2012 | Minor improvement of error diagnosis |
| Alpha 04c | 23 February 2012 | Tamp-Blow applicator supported |
| KD23 for Display | June 2012 | Display usable for Alpha Compact and Legi-Air |

---

## 8. System Options

The labeler Alpha Compact can be equipped with many different options, subdivided into three groups.

### Subdivision of Alpha Compact Product Range

#### Pre-configured Alpha Compact (Basis version)
Labeler in Wipe On working method, for labels with a width of maximum 120 mm or 150 mm, in righthand and lefthand version. Available ex-stock.

#### Retrofit Options (Field Installable)
Available ex-stock and can be installed at the Alpha Compact by the customer on-site. Main retrofit options:
- Manual in different languages
- Power cable for different power networks
- Pusher brushes and pusher rollers
- HMI Panel / HMI Display
- Axial low label warning
- Alarm lamp
- Clamp box for I/O interface and product sensor input
- Pneumatic maintenance combination

#### Factory Installable Options
Installed and tested at system order. Main factory installable options:
- Language package 2 to HMI Display
- Shaft encoder
- USB-connection socket
- Zero Down Time Controller

#### Modular Construction
The most important modules:
- Alpha Compact Basis module
- Label detections
- Application with peeler blade
- Application with Tamp Blow Applicator
- Application with 90°/180° rotating tamp
- Unwinding

---

## 9. Maintenance

### Safety Instructions

> **⚡ DANGER TO LIFE!** Disconnect the power from the machine before you perform any work at the labeler.

> **⚠️ DANGER OF BEING CRUSHED!** Perform maintenance work only if you have control of product supply and there is no danger.

> **⚠️ HEALTH HAZARD!** For lubricants and detergents, observe the valid safety data sheets and disposal regulations.

> **⚠️ NOTICE:** Never use sharp-edged or hard objects for cleaning the feed-driver roller and sensors. Use only compressed air spray (21800768) for cleaning.

**Detergents:** Use cleaning set, partno. 2180981.

**Cleaning intervals** depend on environmental conditions and machine capacity. Clean the labeler before every change of labeling paper or ink ribbon.

### Daily Maintenance (After Approx. 8 Hours of Operation)

**Required Resources:**
- Roller solvent (21800977)
- Alcohol (21800915)
- Compressed air spray (21800768)
- Lint-free cloth (21800978)
- Label remover (21800771)
- Soft brush (round or plain approx. 10 mm)

| Step | Procedure |
|---|---|
| 1 | Clean labeler according to the cleaning instructions. |
| 2 | Check/clean the air filter from the protective cabinet (if available). |

### Weekly Maintenance (After Approx. 40 Hours of Operation)

| Step | Procedure |
|---|---|
| 1 | Clean labeler according to the cleaning instructions. |
| 2 | Check/clean the air filter from the protective cabinet (if available). |
| 3 | Clean all sensors (product sensor, low label sensor and label gap sensor) carefully with a soft brush or compressed air. |
| 4 | Examine all roller assemblies for free rotation, correct fixed axes. |

### Six Month Maintenance (After Approx. 1000 Hours of Operation)

**Required Resources:** Vacuum Cleaner

| Step | Procedure |
|---|---|
| 1 | Replace the air filter elements (if available). |
| 2 | Clean the system cover outside and the protective cabinet inside using an industrial vacuum cleaner. **Do not use air pressure** from the shop air supply (can contain water and oil traces). |

### Yearly Maintenance (After Approx. 2000 Hours of Operation)

| Step | Procedure |
|---|---|
| 1 | Examine label liner rewinder and friction clutch for excessive wear. Check all timing belts for wear and correct tension. |
| 2 | Check all moving parts for wear and bearing clearance. |
| 3 | Check all electric connectors and connecting devices. |
| 4 | Check all pneumatic connections. |

### Spare Parts

> **⚠️ HEALTH HAZARD!** Wrong or faulty spare parts may affect the safety and may lead to injuries or damages. Use only **original spare parts** or parts approved explicitly by the Bluhm Weber Group.

The spare parts of the labeler ALPHA COMPACT are included in a separate documentation (part number 32708614).

---

## 10. Troubleshooting

### Safety Instructions

> **⚡ DANGER TO LIFE!** Disconnect the power from the machine before you perform any work.

> **⚠️ DANGER OF BEING CRUSHED!** Perform maintenance work only if you have control of product supply and there is no danger.

> **CHECK:** Permanently check all machine operations. Abnormal noise development or movements indicate failures and have to be checked.

**Instructions for elimination of failures address only to trained personal.**

### Correcting Adjustments Based on Labeler Result

| Result | Description | Action |
|---|---|---|
| ✅ **Good result** | Label is free from creases, straight, always at same position. | No corrections necessary. |
| ❌ **Creases in label** | The label has creases. | 1. Examine application speed. 2. Adjust height of pusher roller (pressure too low). 3. Examine rotating shaft encoder setup. |
| ❌ **Beveled label** | Label is tilted on product. | Correct inclination of the labeler and the peeler blade. |
| ❌ **Position displacement** | Label position changes from product to product. | Check product sensor, distance from peeler plate to product, acceleration/braking ramp settings, stop sensor, distance from guidance to product supply, application speed, and shaft encoder setup. |
| ❌ **Incorrect position** | Label not in desired position on product. | Check position of product sensor, height setting of peeler blade, and product guiding of the conveying system (guideline: approx. 1–2 mm). |

### Error Description

| Problem | Possible Cause | Solution |
|---|---|---|
| Label liner breaks | Damage of label roll; nicks on liner; dents at label roll edge; incorrect/damaged peeler blade | Exchange label roll; remove adhesive residues. |
| Label positioning incorrect | Product not constantly in correct labeling position; misaligned product-sensor | Check conveyor speed consistency; use guide bars; use shaft encoder/tacho; check sensor adjustment. |
| Multiple labeling | Start/trigger signal bouncing | Exchange defective sensor; check PLC outgoing signal and debounce if necessary. |
| Label not applied | No product detection; pollution; sensor type doesn't suit product | Clean reflector or sensor; check sensor adjustment. |
| Cannot reach required application rate | Required rate exceeds specifications; incorrect configuration; slip at shaft encoder | Check system data; reduce product speed; check labeler setup. |
| Labeler applies without evident reason | Sensor loose or vibrating; loose cable connections | Check sensor adjustment; check all connections. |
| Label does not stop constantly at peeler bar | Label incorrectly detected; polluted label sensor; band brake too tight; label longer than 300 mm | Clean/check label sensor; adjust band brake; set label size in parameter [01 Label Length]. |
| Double-labeling | Feed-length for applying cycle is longer than two label lengths | Reduce overrun distance or shorten driving ramps. |
| Labeler stops immediately | Stress peaks in power network | Restart labeler; install mains filter if stops occur increasingly often. |

### Error Messages via Display

| Display Message | Description | Cause/Solution |
|---|---|---|
| NOT RESPONDING | Internal communication problems between controller and motor control | Check cable connections; check for strong magnetic fields in environment. |
| PARAMETERS ERROR | Memory-test checksum error when switching on | Activated parameters might be damaged; contact Service Hotline if error persists. |
| TRIGGER ERROR | Trigger for application comes during application cycle | Increase distance between products or increase acceleration ramps. |
| L. EDGE NOT FOUND | Label sensor does not detect label material | Check sensor setting for label detection; check labels are on label liner. |

### Signal Action Sequence in the Labeler

After product sensor input changes from low to high:
1. Waiting for adjusted TRIGGER DELAY
2. Registration of conveying speed via DIG (if connected)
3. Activation of SYNC-relay
4. Label feed in predefined speed
5. Waiting for adjusted SYNC PULSE time
6. Deactivation of SYNC-relay
7. Waiting for adjusted TRIGGER BLANK
8. Label counter counts up

### Notes Regarding Requirements to Label Material

For correct operation of the standard label/stop-light barrier:
- Label material is not transparent
- Label material has gaps of minimum 3 mm
- Labels are stamped completely (without disposal fence)
- Label liner is light-transmissive

### Remarks Regarding Stress Peaks

At recurring transients (stress peaks in power network), the labeler may stop. Stored parameters are not deleted. To make ready for operation again, push **[Start]**. If stops occur increasingly often, install a mains filter or an undervoltage power supply before the labeler.

### Set the Labeler Back to Delivery Status

| Step | Operating Elements | Description |
|---|---|---|
| 1 | | Disconnect the labeler from power supply. |
| 2 | **[Start]** + **[Stop]** | Push the start + stop buttons and keep them pushed. |
| 3 | | Connect the labeler with the power network. |
| 4 | | Keep the start and stop buttons still 5 seconds pressed until the labeler is again ready for operation. |

---

## 11. Index

| Term | Page | Term | Page |
|---|---|---|---|
| Access | 34 | Disposal | 23 |
| Access Code | 91, 112 | Double-Labeling | 130 |
| Adhesive Residue | 120 | Dusty Environment | 15 |
| Adjust label width | 58 | Encoder | 47 |
| Air Assist | 10, 71, 72 | Error | 128 |
| Air Blast | 10 | Event Counter | 88 |
| Alarm Lamp | 49 | Explanation of Danger Degrees | 14 |
| Application Accuracy | 44 | Explanation of Technical Terms | 10 |
| Application Modi | 27 | Factory Setting | 10 |
| Applying Mode | 26 | Firmware | 113 |
| Authorized Personnel | 22 | Food | 15 |
| Blow-On-Mode | 27 | Hints for Use of this Manual | 8 |
| Case of an Emergency | 14 | Hotline | 9 |
| Cleaning | 120 | Installation | 34 |
| Configuration Menu | 90 | Intended Use | 15 |
| Connection to Supply Voltage | 37 | Label Calibration | 64, 80, 82 |
| Correcting Adjustments | 124 | Labeling Operation | 77, 78 |
| Coupling setting | 69 | Limitation of Liability | 7 |
| Daily Maintenance | 119 | Maintenance | 116 |
| Delivery status | 133 | Operation | 76 |
| Description of the Labeler | 26 | Password | 91, 112 |
| Safety Regulations | 14 | Spare Parts | 122 |
| Service Hotline | 9 | Technical Specifications | 24 |
| Tamp-Blow-Mode | 27 | Transport | 29 |
| Tamp-On-Mode | 27 | Troubleshooting | 123 |
| Wipe-On | 26, 27 | Warranty Clause | 7 |

---

## 12. EC-Declaration of Conformity

*(EC-Declaration of Conformity document included in original manual)*

---

*Version: 14.12.2012 | Part number: 32708612*  
*Weber Marking Systems GmbH – Bluhm Weber Group*
