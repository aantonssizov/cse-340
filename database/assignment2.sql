-- Data for table `account`
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update Tony Stark account to `Admin` type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Delete Tony Stark account
DELETE FROM public.account
WHERE account_id = 1;
-- Update description of `GM Hummer`
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Select Sport inventory items
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory AS i
    JOIN public.classification AS c ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';
-- UPDATE paths for `inventory` table
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');